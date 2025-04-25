<script setup>
import { ref } from 'vue'

// --- Lógica del script (sin cambios) ---
const name = ref('')
const email = ref('')
const message = ref('')
const isSending = ref(false)
const formMessage = ref('')
const formSuccess = ref(null)
// ¡¡RECUERDA PONER TU CÓDIGO REAL DE FORMSPREE!!
const formspreeEndpoint = 'https://formspree.io/f/YOUR_UNIQUE_CODE' // <--- ¡¡IMPORTANTE!!

async function handleSubmit() {
  isSending.value = true
  formMessage.value = ''
  formSuccess.value = null
  const formData = {
    name: name.value,
    email: email.value,
    message: message.value,
    _subject: `[Portfolio Contact] New message from ${name.value}`, // Asunto más "tech"
  }
  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      formSuccess.value = true
      formMessage.value = 'Transmission successful. Stand by for response.' // Mensaje temático
      name.value = ''
      email.value = ''
      message.value = ''
    } else {
      const errorData = await response.json().catch(() => ({}))
      formSuccess.value = false
      formMessage.value = `// Transmission Error: ${errorData.error || 'System unable to send. Retry?'}` // Mensaje temático
      console.error('Formspree Error:', errorData)
    }
  } catch (error) {
    console.error('Network Error:', error)
    formSuccess.value = false
    formMessage.value = '// Network Failure. Check connection interface.' // Mensaje temático
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="retro-terminal-wrapper">
    <h2 class="terminal-title">&gt; Contact_Interface</h2>
    <form class="contact-form" @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="name">Operator_Name:</label>
        <input
          type="text"
          id="name"
          v-model.trim="name"
          required
          :disabled="isSending"
          autocomplete="name"
          placeholder="User //"
        />
      </div>
      <div class="form-group">
        <label for="email">Contact_Address:</label>
        <input
          type="email"
          id="email"
          v-model.trim="email"
          required
          :disabled="isSending"
          autocomplete="email"
          placeholder="user@domain.net"
        />
      </div>
      <div class="form-group">
        <label for="message">Transmission_Data:</label>
        <textarea
          id="message"
          v-model.trim="message"
          rows="6"
          required
          :disabled="isSending"
          placeholder="Begin transmission..."
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSending">
          <span class="button-text">{{ isSending ? 'Sending...' : 'Transmit()' }}</span>
          <span class="button-caret" v-if="!isSending">_</span>
          <span class="button-loader" v-if="isSending"></span>
        </button>
      </div>

      <Transition name="fade-msg">
        <div
          v-if="formMessage"
          class="form-message"
          :class="{ success: formSuccess === true, error: formSuccess === false }"
          role="alert"
        >
          <span>{{ formMessage }}</span>
        </div>
      </Transition>
    </form>
  </div>
</template>

<style scoped>
/* --- Variables de Color Estilo Retro --- */
:root {
  --retro-bg: #0a0e1a; /* Fondo muy oscuro, azulado/negro */
  --retro-text: #00ff9c; /* Texto principal verde fósforo */
  --retro-glow: rgba(0, 255, 156, 0.5); /* Brillo del texto */
  --retro-accent: #ff7f50; /* Ámbar/Coral para acentos o errores */
  --retro-accent-glow: rgba(255, 127, 80, 0.5);
  --retro-success: #00ff9c; /* Verde para éxito */
  --retro-success-glow: rgba(0, 255, 156, 0.5);
  --retro-error: #ff5555; /* Rojo brillante para error */
  --retro-error-glow: rgba(255, 85, 85, 0.6);
  --retro-border: rgba(0, 255, 156, 0.3); /* Borde sutil */
  --retro-border-focus: var(--retro-text); /* Borde al hacer foco */
  --retro-placeholder: rgba(0, 255, 156, 0.4); /* Placeholder más tenue */
  --retro-button-bg: rgba(0, 255, 156, 0.1);
  --retro-button-hover-bg: rgba(0, 255, 156, 0.2);
  --retro-button-text: var(--retro-text);
}

/* --- Estilo General del Contenedor --- */
.retro-terminal-wrapper {
  background-color: var(--retro-bg);
  padding: 30px 40px;
  border: 2px solid var(--retro-border);
  box-shadow:
    0 0 20px 15px rgba(0, 255, 156, 0.1),
    inset 0 0 5px rgba(0, 0, 0, 0.5);
  font-family: 'Courier New', Courier, monospace; /* Fuente monoespaciada esencial */
  position: relative; /* Para el overlay de scanlines si se activa */
  overflow: hidden; /* Para contener el overlay */
  max-width: 700px; /* Ajusta según necesidad */
  margin: 2rem auto; /* Centrado ejemplo */
}

.terminal-title {
  color: var(--retro-text);
  text-shadow:
    0 0 5px var(--retro-glow),
    0 0 10px var(--retro-glow);
  font-size: 1.5em;
  margin-bottom: 25px;
  font-weight: normal;
  letter-spacing: 1px;
  animation: text-flicker 3s linear infinite alternate;
}

/* --- Formulario y Campos --- */
.contact-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  color: var(--retro-text);
  text-shadow: 0 0 3px var(--retro-glow);
  margin-bottom: 8px;
  font-size: 0.95em;
  letter-spacing: 0.5px;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-group textarea {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* Fondo sutilmente transparente */
  border: 1px solid var(--retro-border);
  color: var(--retro-text);
  text-shadow: 0 0 2px var(--retro-glow);
  padding: 10px 12px;
  font-family: inherit; /* Hereda monoespaciada */
  font-size: 1em;
  caret-color: var(--retro-text); /* Color del cursor de texto */
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5); /* Sombra interior sutil */
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--retro-placeholder);
  opacity: 1; /* Firefox necesita esto */
  font-style: italic;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--retro-border-focus);
  box-shadow:
    0 0 8px var(--retro-glow),
    inset 0 1px 3px rgba(0, 0, 0, 0.5); /* Brillo exterior al enfocar */
}

.form-group textarea {
  resize: none; /* Deshabilitar redimensionar o dejar 'vertical' */
  min-height: 150px;
}

/* --- Botón de Envío --- */
.form-actions {
  margin-top: 30px;
}

button[type='submit'] {
  background-color: var(--retro-button-bg);
  border: 1px solid var(--retro-text);
  color: var(--retro-button-text);
  text-shadow: 0 0 3px var(--retro-glow);
  padding: 12px 25px;
  font-family: inherit;
  font-size: 1em;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;
  position: relative; /* Para el loader */
  display: inline-flex; /* Para alinear texto y caret/loader */
  align-items: center;
}

button[type='submit']:hover:not(:disabled) {
  background-color: var(--retro-button-hover-bg);
  box-shadow: 0 0 10px var(--retro-glow);
  color: #fff; /* Un blanco brillante al pasar el ratón */
}

button[type='submit']:active:not(:disabled) {
  box-shadow:
    inset 0 0 5px rgba(0, 255, 156, 0.5),
    0 0 10px var(--retro-glow);
  transform: translateY(1px); /* Pequeño efecto hundido */
}

button[type='submit']:disabled {
  opacity: 0.5;
  cursor: wait;
  text-shadow: none;
  box-shadow: none;
}

.button-text {
  margin-right: 8px;
}

.button-caret {
  display: inline-block;
  animation: blink-caret 1s step-end infinite;
}

/* Loader simple para el estado 'enviando' */
.button-loader {
  width: 1em;
  height: 1em;
  border: 2px solid var(--retro-border);
  border-top-color: var(--retro-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 8px; /* Espacio respecto al texto "Enviando..." */
}

/* --- Mensajes de Feedback --- */
.form-message {
  margin-top: 25px;
  padding: 15px 20px;
  border: 1px solid;
  font-size: 0.95em;
  line-height: 1.4;
  animation: text-flicker 5s linear infinite alternate; /* Sutil parpadeo también */
}

.form-message.success {
  color: var(--retro-success);
  border-color: var(--retro-success);
  text-shadow: 0 0 5px var(--retro-success-glow);
  background-color: rgba(0, 255, 156, 0.05); /* Fondo muy tenue */
}

.form-message.error {
  color: var(--retro-error); /* Usamos el rojo definido */
  border-color: var(--retro-error);
  text-shadow: 0 0 5px var(--retro-error-glow);
  background-color: rgba(255, 85, 85, 0.05); /* Fondo muy tenue */
}

.form-message span::before {
  content: '// Status: '; /* Prefijo estilo comentario */
  opacity: 0.7;
}

/* --- Transición para el Mensaje --- */
.fade-msg-enter-active,
.fade-msg-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.fade-msg-enter-from,
.fade-msg-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* --- Animaciones --- */
@keyframes blink-caret {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes text-flicker {
  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow:
      0 0 4px var(--retro-glow),
      0 0 8px var(--retro-glow),
      0 0 12px var(--retro-glow);
  }
  20%,
  24%,
  55% {
    text-shadow: none;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- Opcional: Efecto Scanlines --- */
/* Descomenta esto si quieres añadir el efecto */
/*
.scanline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px; / Ajusta el grosor de las líneas /
  pointer-events: none; / Para que no interfiera con el form /
  z-index: 1; / Encima del fondo pero debajo del contenido /
  opacity: 0.4; / Ajusta la intensidad /
}

.contact-form {
  position: relative; / Asegura que el contenido esté por encima del overlay /
  z-index: 2;
}
*/
</style>
