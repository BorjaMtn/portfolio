<script setup>
// ... (Mismo script setup que la versión retro anterior con tecleo)
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'
import { useContentStore } from '@/stores/content'
import ProjectCard from './ProjectCard.vue'
import SkillBadge from './SkillBadge.vue'
import AboutSection from './content/AboutSection.vue'
import ContactForm from './ContactForm.vue'

const uiStore = useUiStore()
const contentStore = useContentStore()

const { activeSection } = storeToRefs(uiStore)
const { projects, skills } = storeToRefs(contentStore)

// --- Interactividad: Efecto de tecleo para el título ---
const typedTitle = ref('')
const isTyping = ref(false)
let typingTimeout = null

const typeEffect = (targetText, elementRef, callback = () => {}) => {
  clearTimeout(typingTimeout)
  elementRef.value = ''
  isTyping.value = true
  let i = 0
  const speed = 35

  function typeChar() {
    if (i < targetText.length) {
      elementRef.value += targetText.charAt(i)
      i++
      typingTimeout = setTimeout(typeChar, speed)
    } else {
      isTyping.value = false
      callback()
    }
  }
  typeChar()
}

watch(
  activeSection,
  (newSection) => {
    let title = ''
    switch (newSection) {
      case 'about':
        title = ' Ejecutando: about_me.exe'
        break
      case 'skills':
        title = ' Analizando: skills_matrix.dat'
        break
      case 'projects':
        title = ' Cargando: projects_archive.zip'
        break
      case 'contact':
        title = ' Abriendo: contact_form.sh'
        break
      case 'cv':
        title = ' Accediendo: classified_cv.pdf'
        break
      default:
        title = ' Sistema Listo :: Esperando Comando...'
    }
    typeEffect(`> ${title}`, typedTitle)
  },
  { immediate: true },
)
</script>

<template>
  <div class="content-area content-area-retro">
    <h2 class="retro-title">
      <span class="typed-text">{{ typedTitle }}</span>
      <span class="cursor" :class="{ 'is-typing': isTyping }">█</span>
    </h2>

    <div class="retro-content-wrapper">
      <Transition name="retro-load" mode="out-in">
        <div :key="activeSection" class="section-container">
          <AboutSection v-if="activeSection === 'about'" />

          <div v-else-if="activeSection === 'skills'">
            <div v-for="category in skills" :key="category.category" class="skill-category">
              <h3 class="retro-category-title">// {{ category.category }}</h3>
              <div class="badges-container">
                <SkillBadge
                  v-for="skill in category.skills"
                  :key="skill.name"
                  :skill="skill"
                  class="skill-badge-retro"
                />
              </div>
            </div>
          </div>

          <div v-else-if="activeSection === 'projects'">
            <div class="projects-grid">
              <ProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
                class="project-card-retro"
              />
            </div>
          </div>

          <div v-else-if="activeSection === 'contact'">
            <ContactForm class="contact-form-retro" />
          </div>

          <div v-else-if="activeSection === 'cv'">
            <p class="retro-text-block">
              Archivo `cv.pdf` localizado en el directorio `/secure/docs/`.<br />
              Listo para transferencia segura. ¿Iniciar descarga?
            </p>
            <a href="/cv.pdf" download class="cv-link button-retro"> [ SÍ, DESCARGAR AHORA ] </a>
          </div>

          <div v-else class="welcome-message">
            <p class="retro-text-block">
              Directorio raíz `/`.<br />
              Utiliza el panel de navegación lateral para ejecutar comandos.
            </p>
            <pre class="ascii-art">
   ____        __        __    _      __
  / __ \____ _/ /_____ _/ /_  (_)____/ /_
 / / / / __ `/ __/ __ `/ __ \/ / ___/ __/
/ /_/ / /_/ / /_/ /_/ / / / / (__  ) /_
\____/\__,_/\__/\__,_/_/ /_/_/____/\__/
            </pre>
          </div>
        </div>
      </Transition>
    </div>
    <div class="scanlines-overlay"></div>
  </div>
</template>

<style scoped>
/* --- Estilo Base del Contenedor y Variables CSS Scoped --- */
.content-area-retro {
  /* --- Variables CSS Scoped a este componente y sus hijos --- */
  --retro-font: 'VT323', monospace;
  --retro-bg: #0a0f0a;
  --retro-text: #33ff33;
  --retro-text-secondary: #22aa22;
  --retro-highlight: #ffcc00;
  --retro-border: #22aa22;
  --retro-glow: rgba(51, 255, 51, 0.2);
  /* ---------------------------------------------------------- */

  font-family: var(--retro-font);
  background-color: var(--retro-bg);
  color: var(--retro-text);
  border: 2px solid var(--retro-border);
  padding: 15px 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 15px var(--retro-glow),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
}

/* --- Efecto Scanlines (opcional) --- */
/* (Sin cambios, ya usa clases y está dentro de scoped) */
.scanlines-overlay {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 51%);
  background-size: 100% 3px;
  pointer-events: none;
  z-index: 5;
  animation: scanline-move 12s linear infinite;
}

@keyframes scanline-move {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 -12px;
  }
}

/* --- Título Retro y Cursor --- */
/* (Sin cambios, ya usan variables definidas arriba y están dentro de scoped) */
.retro-title {
  color: var(--retro-highlight);
  margin: 0 0 15px 0;
  font-size: 1.3em;
  font-weight: normal;
  white-space: pre;
  height: 1.5em;
  border-bottom: 1px dashed var(--retro-border);
  padding-bottom: 10px;
  flex-shrink: 0;
}

.cursor {
  display: inline-block;
  background-color: var(--retro-text);
  color: var(--retro-text);
  margin-left: 2px;
  animation: blink 1.1s step-end infinite;
  opacity: 1;
  width: 0.6em;
  height: 1.1em;
  vertical-align: baseline;
}

.cursor.is-typing {
  animation: none;
  opacity: 0;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.retro-content-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: var(--retro-bg);
    border-left: 1px solid var(--retro-border);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--retro-text);
    border: 1px solid var(--retro-text-secondary);
  }
  scrollbar-width: thin;
  scrollbar-color: var(--retro-text) var(--retro-bg);
}

.section-container {
  padding-top: 10px;
}

h2 {
  display: none;
}

h3.retro-category-title {
  margin-top: 25px;
  margin-bottom: 10px;
  color: var(--retro-text);
  border: none;
  border-left: 3px solid var(--retro-highlight);
  padding-left: 8px;
  font-size: 1.1em;
  font-weight: normal;
  text-transform: uppercase;
}
.skill-category:first-child h3.retro-category-title {
  margin-top: 0;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 11px;
}

.skill-badge-retro {
  border: 1px solid var(--retro-text-secondary);
  padding: 3px 8px;
  font-size: 0.9em;
  background-color: transparent;
  color: var(--retro-text-secondary);
  cursor: default;
  transition: all 0.2s ease-in-out;
}
.skill-badge-retro:hover {
  background-color: var(--retro-text-secondary);
  color: var(--retro-bg);
  box-shadow: 0 0 5px var(--retro-text-secondary);
}

/* Proyectos */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 15px;
}

.project-card-retro {
  border: 1px solid var(--retro-border);
  background-color: rgba(51, 255, 51, 0.03);
  padding: 15px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
.project-card-retro:hover {
  border-color: var(--retro-text);
  box-shadow: inset 0 0 8px var(--retro-glow);
}

/* Bloques de texto general */
.retro-text-block {
  color: var(--retro-text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
}

/* Botón Retro General */
.button-retro {
  display: inline-block;
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid var(--retro-highlight);
  color: var(--retro-highlight);
  text-decoration: none;
  font-weight: normal;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
}
.button-retro:hover {
  background-color: var(--retro-highlight);
  color: var(--retro-bg);
  box-shadow: 0 0 8px var(--retro-highlight);
}

/* Mensaje de Bienvenida y ASCII Art */
.welcome-message .retro-text-block {
  margin-bottom: 15px;
}
.ascii-art {
  color: var(--retro-text-secondary);
  font-size: 0.8em;
  line-height: 1.1;
  text-align: center;
  white-space: pre;
  margin-top: 20px;
  user-select: none;
}

/* Transición Retro */
.retro-load-enter-active {
  transition: opacity 0.4s steps(4, end);
}
.retro-load-leave-active {
  transition: opacity 0.15s ease-out;
}
.retro-load-enter-from,
.retro-load-leave-to {
  opacity: 0;
}

/* --- Ocultar estilos originales si entran en conflicto --- */
.skill-category > h3:not(.retro-category-title) {
  display: none;
}
a.cv-link:not(.button-retro) {
  display: none;
}
</style>
