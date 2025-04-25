<script setup>
import { ref } from 'vue'

defineProps({
  project: {
    type: Object,
    required: true,
  },
})

// No es estrictamente necesario para los estilos de hover/focus CSS,
// pero se mantiene por si se añade lógica JS dependiente en el futuro.
const isInteracting = ref(false)
</script>

<template>
  <div
    class="project-card-retro"
    tabindex="0"
    @mouseenter="isInteracting = true"
    @mouseleave="isInteracting = false"
    @focusin="isInteracting = true"
    @focusout="isInteracting = false"
  >
    <div class="monitor-bezel">
      <div class="led-indicator"></div>

      <div class="screen-area">
        <div class="screen-effects"></div>
        <div class="screen-content">
          <div v-if="project.imageUrl" class="project-image-crt-wrapper">
            <img
              :src="project.imageUrl"
              :alt="`Output for ${project.title}`"
              class="project-image-crt"
              loading="lazy"
            />
          </div>

          <div class="prompt-line">
            <span class="prompt-symbol primary-prompt">></span>
            <h3 class="project-title-crt">{{ project.title }}</h3>
          </div>

          <p class="short-desc-crt">{{ project.shortDescription }}</p>

          <div class="reveal-content-crt">
            <p class="long-desc-crt">{{ project.longDescription }}</p>
            <div class="technologies-crt">
              <span class="prompt-symbol tech-prompt">> Tech_Stack:</span>
              <span v-for="tech in project.technologies" :key="tech" class="tech-tag-crt">
                [{{ tech }}]
              </span>
            </div>
            <div class="project-links-crt">
              <span class="prompt-symbol link-prompt">> Links:</span>
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link-crt link-demo"
                >[Demo]</a
              >
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link-crt link-repo"
                >[Code]</a
              >
            </div>
          </div>

          <span class="blinking-cursor">_</span>
        </div>
      </div>
    </div>
    <div class="glitch-overlay"></div>
  </div>
</template>

<style scoped>
/* --- Fuentes Retro --- */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

:root {
  /* --- Paleta Retro Mejorada --- */
  --crt-bg-color: #1a1d1a; /* Fondo de pantalla ligeramente más oscuro */
  --crt-text-color: #33ff33; /* Verde fósforo principal */
  --crt-text-dim-color: #28a028; /* Verde más tenue para descripciones cortas o tags */
  --crt-glow-color: rgba(51, 255, 51, 0.45); /* Glow verde más notable */

  /* --- Color Secundario: Ámbar (Más protagónico) --- */
  --crt-amber-color: #ffa500; /* Naranja/Ámbar brillante */
  --crt-amber-dim-color: #cc8400; /* Ámbar oscuro para prompts */
  --crt-amber-glow-color: rgba(255, 165, 0, 0.4); /* Glow ámbar */

  /* --- Colores del Bisel: Beige Clásico --- */
  --crt-bezel-light: #e0d8c0; /* Beige claro */
  --crt-bezel-dark: #c8c0a8; /* Beige más oscuro */
  --crt-bezel-shadow: rgba(80, 70, 50, 0.5); /* Sombra interior más cálida y oscura */

  /* --- Colores del LED --- */
  --crt-led-off-color: #4d1a1a; /* Rojo muy oscuro apagado */
  --crt-led-on-color: #ff3333; /* Rojo brillante encendido */
  --crt-led-glow-color: rgba(255, 51, 51, 0.7); /* Glow rojo intenso */

  /* --- Otros --- */
  --crt-scanline-color: rgba(0, 0, 0, 0.25); /* Scanlines más sutiles */
  --crt-noise-color: rgba(255, 255, 255, 0.025); /* Ruido más fino */
  --crt-font-primary: 'VT323', monospace;
  --crt-font-title: 'Press Start 2P', cursive;
  --crt-border-radius: 6px; /* Bordes ligeramente menos redondeados */
  --transition-retro-fast: 0.2s step-end;
  --transition-retro-med: 0.4s ease-out; /* Usar ease-out para hover */
}

/* --- Contenedor Principal --- */
.project-card-retro {
  position: relative;
  font-family: var(--crt-font-primary);
  color: var(--crt-text-color);
  border-radius: calc(var(--crt-border-radius) + 10px); /* Adaptar al padding del bisel */
  overflow: visible; /* Permitir que el glow exterior se vea */
  transform: scale(1);
  transition:
    transform 0.3s ease,
    box-shadow 0.4s ease;
  cursor: default;
  /* Sombra base sutil */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  outline: none; /* Quitar outline por defecto */
}

/* --- Bisel del Monitor --- */
.monitor-bezel {
  position: relative;
  background: linear-gradient(140deg, var(--crt-bezel-dark) 0%, var(--crt-bezel-light) 100%);
  padding: 28px; /* Bisel más grueso */
  border-radius: inherit;
  box-shadow:
    inset 0 0 20px 5px var(--crt-bezel-shadow),
    /* Sombra interior más pronunciada */ 0 3px 6px rgba(0, 0, 0, 0.25); /* Sombra exterior suave */
  overflow: hidden;
}

/* --- Indicador LED --- */
.led-indicator {
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: var(--crt-led-off-color);
  border: 1px solid rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.8);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  z-index: 5;
}

/* --- Área de Pantalla --- */
.screen-area {
  position: relative;
  background-color: var(--crt-bg-color);
  border-radius: var(--crt-border-radius);
  overflow: hidden;
  /* Perspectiva aumentada y sombra interior más fuerte */
  transform: perspective(1500px) scale(1.01);
  transition: transform var(--transition-retro-med);
}

/* --- Efectos de Pantalla (Scanlines y Flicker) --- */
.screen-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden; /* Asegura que los pseudo-elementos no se salgan */
  border-radius: inherit; /* Hereda redondez de la pantalla */
}
.screen-effects::after {
  /* Scanlines */
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 1px,
    var(--crt-scanline-color) 1px,
    var(--crt-scanline-color) 2px
  );
  opacity: 0.7;
  animation: scanlinesMove 25s linear infinite; /* Más lento */
}
.screen-effects::before {
  /* Flicker/Noise */
  content: '';
  position: absolute;
  inset: 0;
  background: var(--crt-noise-color);
  opacity: 1;
  animation: flicker 0.12s infinite alternate; /* Flicker ligeramente más rápido */
}

/* --- Contenido de la Pantalla --- */
.screen-content {
  position: relative;
  padding: 1.5rem; /* Más padding interior */
  z-index: 1;
  /* Glow de texto refinado */
  text-shadow:
    0 0 7px var(--crt-glow-color),
    0 0 12px var(--crt-glow-color);
}

/* Imagen del Proyecto */
.project-image-crt-wrapper {
  margin-bottom: 1.2rem;
  border: 1px solid var(--crt-text-dim-color);
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.4);
  display: inline-block;
  max-width: calc(100% - 10px); /* Ajustar al padding */
}
.project-image-crt {
  display: block;
  max-width: 100%;
  height: auto;
  image-rendering: pixelated; /* Crucial para look retro */
  filter: grayscale(40%) contrast(1.15) brightness(0.95); /* Ajuste de filtro */
  opacity: 0.9;
}

/* Prompts (Usan color Ámbar) */
.prompt-symbol {
  margin-right: 0.7ch;
  color: var(--crt-amber-dim-color); /* Ámbar oscuro para prompts */
  text-shadow: 0 0 6px var(--crt-amber-glow-color);
  user-select: none;
  line-height: inherit; /* Asegurar alineación */
}
.prompt-line {
  display: flex;
  align-items: baseline; /* Mejor alineación */
  margin-bottom: 0.6rem;
}
.tech-prompt,
.link-prompt {
  display: block; /* Ocupa su línea */
  margin-bottom: 0.4rem;
  color: var(--crt-amber-dim-color);
  text-shadow: 0 0 6px var(--crt-amber-glow-color);
}

/* Título */
h3.project-title-crt {
  font-family: var(--crt-font-title);
  font-size: 1.1rem; /* Ligeramente más grande */
  color: var(--crt-text-color); /* Verde principal */
  margin: 0;
  display: inline;
  text-transform: uppercase;
  line-height: 1.2; /* Ajuste de línea */
}

/* Descripciones */
.short-desc-crt,
.long-desc-crt {
  font-size: 1.05rem; /* Texto ligeramente más grande */
  line-height: 1.6; /* Mayor interlineado */
  margin-bottom: 1.2rem;
  white-space: pre-wrap; /* Conservar saltos de línea */
}
.short-desc-crt {
  color: var(--crt-text-dim-color); /* Verde tenue */
}
.long-desc-crt {
  color: var(--crt-text-color); /* Verde principal */
}

/* Contenido Revelable */
.reveal-content-crt {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(10px) scaleY(0.95); /* Sutil efecto al revelar */
  transform-origin: top;
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out,
    max-height 0.5s ease-out;
}

/* Tecnologías y Links */
.technologies-crt,
.project-links-crt {
  margin-bottom: 1.2rem;
  font-size: 0.95rem; /* Ligeramente más grande */
}
.tech-tag-crt {
  display: inline-block;
  margin-right: 1ch;
  margin-bottom: 0.4rem;
  color: var(--crt-text-dim-color);
  cursor: default;
  padding: 1px 4px; /* Pequeño padding */
  background-color: rgba(0, 0, 0, 0.2); /* Fondo sutil */
  border-radius: 2px;
}
.project-link-crt {
  display: inline-block;
  margin-right: 1ch;
  margin-bottom: 0.4rem;
  color: var(--crt-text-color); /* Verde principal */
  text-decoration: none;
  transition:
    background-color var(--transition-retro-fast),
    color var(--transition-retro-fast),
    text-shadow var(--transition-retro-fast),
    box-shadow var(--transition-retro-fast);
  cursor: pointer;
  padding: 1px 5px; /* Padding ligeramente mayor */
  border-radius: 2px;
  outline: none; /* Quitar outline por defecto */
}

/* Cursor Parpadeante */
.blinking-cursor {
  display: inline-block;
  background-color: var(--crt-text-color);
  width: 0.8ch; /* Ligeramente más ancho */
  height: 1.6ex; /* Ligeramente más alto */
  margin-left: 0.4ch;
  animation: blink 1.1s step-end infinite; /* Parpadeo más lento */
  box-shadow: 0 0 6px var(--crt-glow-color);
  vertical-align: baseline; /* Mejor alineación vertical */
}

/* Efecto Glitch Overlay */
.glitch-overlay {
  position: absolute;
  inset: 0;
  /* Gradiente más sutil o diferente para el glitch */
  background: linear-gradient(
    180deg,
    rgba(51, 255, 51, 0.1) 0%,
    rgba(51, 255, 51, 0.3) 50%,
    rgba(51, 255, 51, 0.1) 100%
  );
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: glitch 0.35s steps(3, jump-none) 0s 1 forwards; /* Ajuste de animación */
  visibility: hidden;
  border-radius: inherit;
}

/* --- ESTADO HOVER / FOCUS-WITHIN --- */
.project-card-retro:hover,
.project-card-retro:focus-within {
  transform: scale(1.035); /* Escala ligeramente mayor */
  /* Sombra exterior más pronunciada y con color del glow */
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    /* Sombra base más grande */ 0 0 25px var(--crt-glow-color); /* Glow exterior verde */
}

/* Encender LED */
.project-card-retro:hover .led-indicator,
.project-card-retro:focus-within .led-indicator {
  background-color: var(--crt-led-on-color);
  box-shadow:
    0 0 10px var(--crt-led-glow-color),
    /* Glow rojo más intenso */ inset 0 0 3px rgba(255, 255, 255, 0.6);
}

/* Intensificar pantalla al interactuar */
.project-card-retro:hover .screen-area,
.project-card-retro:focus-within .screen-area {
  transform: perspective(1500px) scale(1.02); /* Escala interior sutil */
}

/* Acelerar flicker al interactuar */
.project-card-retro:hover .screen-effects::before,
.project-card-retro:focus-within .screen-effects::before {
  animation-duration: 0.07s; /* Más rápido */
}

/* Revelar contenido */
.project-card-retro:hover .reveal-content-crt,
.project-card-retro:focus-within .reveal-content-crt {
  opacity: 1;
  transform: translateY(0) scaleY(1);
  max-height: 1500px; /* Suficiente altura */
  overflow: visible;
  transition-delay: 0.05s; /* Pequeño retraso para suavizar */
}

/* Estilo de links al interactuar (Ámbar Invertido) */
.project-link-crt:hover,
.project-link-crt:focus-visible {
  background-color: var(--crt-amber-color); /* Fondo ámbar */
  color: var(--crt-bg-color); /* Texto oscuro */
  text-shadow: none; /* Quitar sombra de texto */
  box-shadow: 0 0 10px var(--crt-amber-glow-color); /* Glow ámbar */
}

/* Activar Glitch */
.project-card-retro:hover .glitch-overlay,
.project-card-retro:focus-within .glitch-overlay {
  opacity: 0.8; /* Opacidad controlada */
  visibility: visible;
  animation: glitch 0.35s steps(3, jump-none) 0s 1 forwards;
}

/* --- Keyframes Animaciones (Ajustes menores) --- */
@keyframes flicker {
  /* Más variación */
  0%,
  100% {
    opacity: 1;
  }
  25% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.95;
  }
  75% {
    opacity: 0.85;
  }
}
@keyframes scanlinesMove {
  from {
    background-position-y: 0;
  }
  to {
    background-position-y: -4px;
  } /* Movimiento más corto */
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
@keyframes glitch {
  /* Ajustado para ser más sutil */
  0% {
    transform: translate(0);
    opacity: 0;
    visibility: hidden;
  }
  10% {
    transform: translate(-1px, 1px);
    opacity: 0.2;
    visibility: visible;
  }
  20% {
    transform: translate(1px, -1px);
    opacity: 0.1;
  }
  /* ... (mantener o ajustar pasos intermedios) ... */
  90% {
    transform: translate(1px, 1px);
    opacity: 0.4;
  }
  100% {
    transform: translate(0);
    opacity: 0;
    visibility: hidden;
  }
}

/* --- Accesibilidad Foco Visible --- */
.project-card-retro:focus-visible {
  /* Replicar efectos visuales clave del hover */
  transform: scale(1.035);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    0 0 25px var(--crt-glow-color);
  /* Añadir un outline distintivo que use el color ámbar */
  outline: 3px solid var(--crt-amber-color);
  outline-offset: 4px; /* Espacio entre el borde y el outline */
}
/* Asegurar que el LED también se encienda con :focus-visible */
.project-card-retro:focus-visible .led-indicator {
  background-color: var(--crt-led-on-color);
  box-shadow:
    0 0 10px var(--crt-led-glow-color),
    inset 0 0 3px rgba(255, 255, 255, 0.6);
}
/* Estilo foco para links (igual que hover) */
.project-link-crt:focus-visible {
  background-color: var(--crt-amber-color);
  color: var(--crt-bg-color);
  text-shadow: none;
  box-shadow: 0 0 10px var(--crt-amber-glow-color);
}
</style>
