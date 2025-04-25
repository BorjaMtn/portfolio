<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'

// --- Estado Reactivo ---
const history = ref([]) // Array de objetos: { type: 'input'/'response'/'error', html: '...' }
const command = ref('') // Input actual
const isTyping = ref(false) // Para deshabilitar input mientras "escribe" la respuesta
const terminalOutputRef = ref(null) // Ref para el div de output (scroll)
const commandInputRef = ref(null) // Ref para el input (focus)
const commandHistory = ref([]) // Historial de comandos ejecutados para Up/Down
const commandHistoryIndex = ref(-1) // Índice actual en el historial de comandos

// --- Simulación de Sistema de Archivos y Configuración ---
const USERNAME = 'visitante' // Puedes cambiarlo
const HOSTNAME = 'lab-os.dev' // Puedes cambiarlo
const fileSystem = {
  'about.txt': [
    /* ... (contenido como antes) ... */
    '=====================================',
    '==         SOBRE MÍ             ==',
    '=====================================',
    ' Soy un Desarrollador Web Full Stack',
    'altamente ambicioso y motivado, con un firme',
    'compromiso hacia la excelencia y',
    'un enfoque proactivo en el',
    'ámbito laboral. Mi pasión por la',
    'tecnología y la innovación se',
    'traduce en la creación de',
    'soluciones digitales eficientes y',
    'vanguardistas. Estoy preparado',
    'para enfrentar nuevos retos y',
    'contribuir significativamente al',
    'éxito de proyectos dinámicos y',
    'equipos colaborativos.',
  ],
  'skills.txt': [
    /* ... (contenido como antes) ... */
    '=====================================',
    '==         HABILIDADES          ==',
    '=====================================',
    '<strong>Frontend:</strong> Vue.js, React, Pinia, HTML5, CSS3 (Grid/Flexbox), Tailwind',
    '<strong>Backend:</strong>  Node.js, Express, Python (Flask/Django), REST APIs',
    '<strong>BBDD:</strong>     PostgreSQL, MySQL, MongoDB',
    '<strong>Otros:</strong>    Git, Docker, Linux, CI/CD, Testing (Jest/Vitest)',
    '[---> AJUSTA ESTA LISTA A TUS SKILLS REALES <---]',
  ],
  'experience.txt': [
    /* ... (contenido como antes) ... */
    '=====================================',
    '==         TRAYECTORIA          ==',
    '=====================================',
    '- <strong>[Año] - Actual:</strong> [Puesto o Hito Importante]',
    '- <strong>[Año] - [Año]:</strong> [Puesto o Hito Anterior]',
    '- Educación: [Tu Título/Formación]',
    '[---> AÑADE AQUÍ TUS HITOS DE EXPERIENCIA <---]',
  ],
  'contact.txt': [
    /* ... (contenido como antes) ... */
    '=====================================',
    '==           CONTACTO           ==',
    '=====================================',
    // Usaremos HTML para los enlaces clicables
    'Email: <a href="mailto:tu.email@ejemplo.com" target="_blank">tu.email@ejemplo.com</a>',
    'LinkedIn: <a href="https://linkedin.com/in/tu-perfil" target="_blank">linkedin.com/in/tu-perfil</a>',
    'GitHub: <a href="https://github.com/tu-usuario" target="_blank">github.com/tu-usuario</a>',
    'O usa el formulario en la sección "Contacto".',
    '[---> AÑADE AQUÍ TU INFO REAL <---]',
  ],
}

// --- Prompt Computado ---
const promptText = computed(() => `${USERNAME}@${HOSTNAME}:~$`)

// --- Funciones Auxiliares ---
async function scrollToBottom() {
  await nextTick()
  const terminal = terminalOutputRef.value
  if (terminal) {
    terminal.scrollTop = terminal.scrollHeight
  }
}

async function typeResponse(lines) {
  isTyping.value = true
  for (const line of lines) {
    const historyIndex = history.value.push({ type: 'response', html: '' }) - 1
    const targetLine = history.value[historyIndex]
    for (let i = 0; i < line.length; i++) {
      targetLine.html += line[i]
      scrollToBottom()
      // Considera hacer el delay opcional o más corto si se interrumpe
      await new Promise((resolve) => setTimeout(resolve, 15)) // Velocidad ajustada
    }
    await new Promise((resolve) => setTimeout(resolve, 40))
  }
  isTyping.value = false
  await nextTick()
  commandInputRef.value?.focus()
}

// --- Registro de Comandos ---
// Cada comando tiene una función `execute` que recibe `args` y `context`.
// Devuelve un array de líneas de respuesta o `null` si no hay output directo (ej: clear).
const commands = {
  help: {
    description: 'Muestra esta ayuda.',
    execute: (args, context) => {
      const response = ['Comandos disponibles:']
      for (const [name, cmd] of Object.entries(context.commands)) {
        response.push(`  <span class="cmd-name">${name.padEnd(10)}</span> - ${cmd.description}`)
      }
      response.push("Usa 'Tab' para autocompletar comandos y archivos (para 'cat').")
      response.push('Usa Flecha Arriba/Abajo para navegar por el historial.')
      return response
    },
  },
  ls: {
    description: 'Lista archivos/información disponible.',
    execute: (args, context) => {
      return [
        'Archivos disponibles:',
        ...Object.keys(context.fileSystem).map((file) => `  - ${file}`),
      ]
    },
  },
  cat: {
    description: 'Muestra el contenido de uno o más archivos (ej: cat about.txt).',
    execute: (args, context) => {
      if (!args.length) {
        return ['Uso: cat &lt;archivo1&gt; [archivo2] ...']
      }
      const response = []
      args.forEach((filename) => {
        const fileKey = filename.toLowerCase()
        if (context.fileSystem[fileKey]) {
          if (args.length > 1) {
            // Add separator if multiple files
            response.push(`--- Contenido de ${filename} ---`)
          }
          response.push(...context.fileSystem[fileKey])
        } else {
          response.push(
            `<span class="error-color">Error:</span> Archivo no encontrado: ${filename}`,
          )
        }
      })
      return response
    },
  },
  clear: {
    description: 'Limpia la pantalla de la terminal.',
    execute: (args, context) => {
      context.history.value = [] // Modifica el historial directamente
      return ['Terminal reseteada.', `Escribe "help" o "ls".`] // Devuelve mensaje post-limpieza
    },
  },
  date: {
    description: 'Muestra la fecha y hora actual.',
    execute: () => {
      // Nota: Usamos toLocaleString para un formato más legible y localizado
      const now = new Date()
      return [
        now.toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      ]
    },
  },
  whoami: {
    description: 'Muestra el nombre de usuario actual.',
    execute: (args, context) => [`${context.username}`],
  },
  echo: {
    description: 'Muestra un mensaje de texto (ej: echo Hola mundo).',
    execute: (args) => [args.join(' ')], // Une todos los argumentos
  },
  // Podrías añadir más: pwd, cd (requiere estado de directorio), etc.
}

// --- Procesador de Comandos Principal ---
async function handleCommand() {
  if (isTyping.value) return

  const cmdLine = command.value.trim()

  // Añadir al historial visible y al historial de comandos ejecutados
  if (cmdLine) {
    history.value.push({
      type: 'input',
      html: `<span class="prompt-color">${promptText.value}</span> ${cmdLine}`,
    })
    // Añadir al historial de comandos solo si es diferente al último
    if (commandHistory.value[commandHistory.value.length - 1] !== cmdLine) {
      commandHistory.value.push(cmdLine)
    }
    commandHistoryIndex.value = commandHistory.value.length // Reset index para nueva entrada
  } else {
    // Si se presiona Enter sin comando, solo añade el prompt vacío
    history.value.push({
      type: 'input',
      html: `<span class="prompt-color">${promptText.value}</span> `,
    })
  }

  scrollToBottom()
  command.value = '' // Limpiar input

  if (!cmdLine) {
    // No hacer nada más si no hay comando
    await nextTick()
    commandInputRef.value?.focus()
    return
  }

  // Espera un poquito antes de empezar a responder
  await new Promise((resolve) => setTimeout(resolve, 50))

  // Parsear comando y argumentos
  const [cmdName, ...args] = cmdLine.split(' ').filter(Boolean)
  const commandLower = cmdName.toLowerCase()

  let responseLines = []
  const commandToExecute = commands[commandLower]

  if (commandToExecute) {
    try {
      const context = {
        // Pasar contexto al comando
        history: history,
        fileSystem: fileSystem,
        commands: commands,
        username: USERNAME,
        // Podrías añadir más contexto aquí (ej: currentPath si implementas cd)
      }
      const result = commandToExecute.execute(args, context)
      if (result) {
        // Si el comando devuelve líneas de respuesta
        responseLines = result
      }
    } catch (error) {
      console.error('Error ejecutando comando:', error)
      responseLines = [
        `<span class="error-color">Error interno ejecutando '${commandLower}'.</span>`,
      ]
    }
  } else {
    responseLines = [
      `<span class="error-color">Error:</span> Comando no reconocido: ${cmdName}`,
      `Escribe 'help' para ver la lista de comandos.`,
    ]
  }

  // Escribir respuesta (si la hay)
  if (responseLines.length > 0) {
    await typeResponse(responseLines)
  } else {
    // Si no hubo respuesta (ej: comando clear ya limpió), re-enfocar
    await nextTick()
    commandInputRef.value?.focus()
  }
}

// --- Manejadores de Teclado ---

// Navegación por Historial (Flechas Arriba/Abajo)
function handleKeyDown(event) {
  if (isTyping.value) return

  if (event.key === 'ArrowUp' && commandHistory.value.length > 0) {
    event.preventDefault()
    if (commandHistoryIndex.value > 0) {
      commandHistoryIndex.value--
    }
    command.value = commandHistory.value[commandHistoryIndex.value]
    focusInputAndMoveCursorToEnd()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (commandHistoryIndex.value < commandHistory.value.length - 1) {
      commandHistoryIndex.value++
      command.value = commandHistory.value[commandHistoryIndex.value]
    } else {
      // Si estamos al final o más allá, limpiar el input
      commandHistoryIndex.value = commandHistory.value.length
      command.value = ''
    }
    focusInputAndMoveCursorToEnd()
  } else if (event.key === 'Tab') {
    event.preventDefault()
    handleTabCompletion()
  }
}

// Autocompletado (Tab)
async function handleTabCompletion() {
  if (isTyping.value) return

  const currentInput = command.value
  const parts = currentInput.split(' ')
  const currentWord = parts[parts.length - 1] // La palabra actual que se intenta completar
  const commandName = parts[0].toLowerCase()

  let candidates = []
  let baseInput = currentInput.substring(0, currentInput.lastIndexOf(currentWord)) // Parte del input antes de la palabra actual

  // 1. ¿Completar comando? (Si solo hay una palabra o estamos en la primera)
  if (parts.length <= 1 && !currentInput.includes(' ')) {
    candidates = Object.keys(commands).filter((cmd) => cmd.startsWith(currentWord.toLowerCase()))
  }
  // 2. ¿Completar argumento (archivo) para 'cat'?
  else if (commandName === 'cat' && currentWord !== '') {
    candidates = Object.keys(fileSystem).filter((file) =>
      file.startsWith(currentWord.toLowerCase()),
    )
  }
  // Puedes añadir más lógicas para otros comandos aquí (ej: directorios para 'cd')

  if (candidates.length === 1) {
    // Completar si solo hay una opción
    command.value = baseInput + candidates[0] + ' ' // Añadir espacio después de completar
    focusInputAndMoveCursorToEnd()
  } else if (candidates.length > 1) {
    // Mostrar múltiples opciones
    const suggestions = candidates.join('   ') // Separar con espacios
    history.value.push({
      type: 'input',
      html: `<span class="prompt-color">${promptText.value}</span> ${currentInput}`,
    }) // Mostrar input actual
    history.value.push({ type: 'response', html: suggestions }) // Mostrar sugerencias
    scrollToBottom()
    // No cambiamos el input, el usuario elige
    await nextTick()
    commandInputRef.value?.focus()
  }
  // Si no hay candidatos, no hacer nada (beep?)
}

// Helper para enfocar y mover cursor al final tras autocompletar/historial
async function focusInputAndMoveCursorToEnd() {
  await nextTick() // Esperar a que el DOM se actualice con el nuevo valor
  const inputEl = commandInputRef.value
  if (inputEl) {
    inputEl.focus()
    // Mover el cursor al final del input
    // setTimeout necesario a veces para asegurar que ocurra después del render
    setTimeout(() => {
      inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length
    }, 0)
  }
}

// --- Mensaje Inicial ---
onMounted(() => {
  history.value.push({
    type: 'response',
    html: `Iniciando L.A.B. OS v1.0 (${USERNAME}@${HOSTNAME})...`,
  })
  history.value.push({
    type: 'response',
    html: `Bienvenido/a. Escribe "help" para ver los comandos.`,
  })
  commandInputRef.value?.focus()
  scrollToBottom()
})
</script>

<template>
  <div class="about-terminal-container">
    <div class="mini-terminal" @click="commandInputRef?.focus()">
      <div class="terminal-output" ref="terminalOutputRef" aria-live="polite">
        <p
          v-for="(line, index) in history"
          :key="index"
          :class="`line-${line.type}`"
          v-html="line.html"
        ></p>
      </div>
      <div class="terminal-input-line">
        <span class="prompt">{{ promptText }}</span>
        <input
          ref="commandInputRef"
          type="text"
          class="terminal-input"
          v-model="command"
          @keydown.enter.prevent="handleCommand"
          @keydown="handleKeyDown"
          placeholder="Escribe un comando..."
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          :disabled="isTyping"
          aria-label="Entrada de comando de terminal"
        />
        <span class="input-cursor"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Define variables CSS para facilitar la personalización/theming */
:root {
  --terminal-bg: var(--color-background);
  --terminal-text: var(--color-text-primary);
  --terminal-secondary-text: var(--color-text-secondary);
  --terminal-prompt-color: var(--color-accent-primary);
  --terminal-error-color: var(--color-error);
  --terminal-border-color: var(--color-border);
  --terminal-scrollbar-track: var(--color-surface-1);
  --terminal-scrollbar-thumb: var(--color-border);
  --terminal-scrollbar-thumb-hover: var(--color-text-secondary);
  --terminal-font: var(--font-accent);
  --terminal-font-size: 0.9rem;
  --terminal-line-height: 1.6;
  --terminal-padding: 15px;
  --terminal-border-radius: var(--border-radius-base);
  --terminal-cursor-color: var(--terminal-text);
}

.about-terminal-container {
  width: 100%;
  height: 100%; /* O ajusta según necesites */
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

.mini-terminal {
  border: 1px solid var(--terminal-border-color);
  background-color: var(--terminal-bg);
  border-radius: var(--terminal-border-radius);
  padding: var(--terminal-padding);
  font-family: var(--terminal-font);
  font-size: var(--terminal-font-size);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: text; /* Indicar que se puede escribir */
}

/* Añadido :focus-within para controlar el cursor */
.mini-terminal:focus-within .input-cursor {
  display: inline-block; /* Mostrar cursor cuando el input o el contenedor tienen foco */
  animation: blink 1s step-end infinite;
}

.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  line-height: var(--terminal-line-height);
}

.terminal-output p {
  margin: 0 0 3px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Estilos por tipo de línea */
.line-input .prompt-color {
  color: var(--terminal-prompt-color);
  font-weight: bold;
}

/* Estilo para los nombres de comando en 'help' */
:deep(.line-response .cmd-name) {
  color: var(--terminal-prompt-color); /* O otro color distintivo */
  font-weight: 500;
}

.line-response {
  color: var(--terminal-secondary-text);
}
/* Estilo específico para errores dentro de v-html */
:deep(.line-response .error-color),
.line-error .error-color {
  color: var(--terminal-error-color);
  font-weight: bold;
}
/* Estilo para enlaces dentro de v-html */
:deep(.line-response a) {
  color: var(--terminal-prompt-color); /* Usar color del prompt para enlaces */
  text-decoration: underline;
}
:deep(.line-response a:hover) {
  filter: brightness(1.2);
}
:deep(.line-response strong) {
  color: var(--terminal-text); /* Color principal para texto en negrita */
  font-weight: 600;
}

.terminal-input-line {
  display: flex;
  align-items: center;
}

.prompt {
  color: var(--terminal-prompt-color);
  margin-right: 8px;
  white-space: nowrap; /* Evitar que el prompt se rompa */
}

.terminal-input {
  flex-grow: 1;
  background-color: transparent;
  border: none;
  color: var(--terminal-text);
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

.terminal-input:focus {
  outline: none;
  box-shadow: none;
}
.terminal-input:disabled {
  cursor: wait;
}
.terminal-input::placeholder {
  color: var(--terminal-secondary-text);
  opacity: 0.6;
}

/* --- Cursor Parpadeante --- */
.input-cursor {
  /* Inicialmente oculto, se muestra con :focus-within en .mini-terminal */
  display: none;
  width: 8px;
  height: 1.1em;
  background-color: var(--terminal-cursor-color);
  margin-left: 2px;
  vertical-align: middle; /* Alinear mejor con el texto */
}

@keyframes blink {
  from,
  to {
    background-color: transparent;
  }
  50% {
    background-color: var(--terminal-cursor-color);
  }
}

/* Estilos Scrollbar */
.terminal-output::-webkit-scrollbar {
  width: 8px;
}
.terminal-output::-webkit-scrollbar-track {
  background: var(--terminal-scrollbar-track);
  border-radius: 4px;
}
.terminal-output::-webkit-scrollbar-thumb {
  background-color: var(--terminal-scrollbar-thumb);
  border-radius: 4px;
}
.terminal-output::-webkit-scrollbar-thumb:hover {
  background-color: var(--terminal-scrollbar-thumb-hover);
}
</style>
