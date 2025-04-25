<script setup>
import { computed } from 'vue'

const props = defineProps({
  skill: {
    type: Object,
    required: true,
    // Se espera un objeto como:
    // { name: 'JavaScript', icon: '<path d="..."/>' (SVG path data) o 'fas fa-code' (clase icono), color: '#f7df1e' (opcional) }
  },
  // Podemos añadir un prop para controlar la animación globalmente si quisiéramos
  // animated: {
  //   type: Boolean,
  //   default: true
  // }
})

// Computada para manejar el estilo inline si se pasa un color específico
// Esto es opcional, pero da flexibilidad
const badgeStyle = computed(() => {
  if (props.skill.color) {
    // Podríamos definir variables CSS inline para sobreescribir las por defecto
    return {
      '--badge-text-color': props.skill.color,
      '--badge-glow-color': `${props.skill.color}80`, // Añadir alpha para el glow
      '--badge-border-color': `${props.skill.color}40`, // Más tenue para el borde
    }
  }
  return {} // Sin estilo inline si no hay color específico
})

// Para determinar si el icono es una clase de fuente o un path SVG
const isIconClass = computed(() => props.skill.icon && props.skill.icon.includes(' '))
const isIconPath = computed(
  () => props.skill.icon && !isIconClass.value && props.skill.icon.startsWith('<path'),
)
</script>

<template>
  <span class="skill-badge-enhanced" :style="badgeStyle">
    <template v-if="skill.icon">
      <i v-if="isIconClass" :class="['skill-icon', skill.icon]" aria-hidden="true"></i>
      <svg
        v-else-if="isIconPath"
        class="skill-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        v-html="skill.icon"
        aria-hidden="true"
      ></svg>
    </template>

    <span class="skill-name">{{ skill.name }}</span>

    <span class="glitch-overlay" aria-hidden="true">{{ skill.name }}</span>
  </span>
</template>

<style scoped>
/* Heredamos o redefinimos variables del estilo retro si es necesario */
:root {
  /* Colores base (si no vienen del prop 'color') */
  --base-retro-text: #00ff9c;
  --base-retro-glow: rgba(0, 255, 156, 0.5);
  --base-retro-border: rgba(0, 255, 156, 0.3);
  --base-retro-bg: rgba(0, 255, 156, 0.05); /* Fondo muy sutil */
  --base-retro-hover-bg: rgba(0, 255, 156, 0.15);
  --base-retro-hover-border: var(--base-retro-text);
}

.skill-badge-enhanced {
  /* Variables locales que pueden ser sobreescritas por :style */
  --badge-text-color: var(--base-retro-text);
  --badge-glow-color: var(--base-retro-glow);
  --badge-border-color: var(--base-retro-border);
  --badge-bg-color: var(--base-retro-bg);
  --badge-hover-bg-color: var(--base-retro-hover-bg);
  --badge-hover-border-color: var(--base-retro-hover-border);

  display: inline-flex; /* Para alinear icono y texto */
  align-items: center;
  gap: 6px; /* Espacio entre icono y texto */
  background-color: var(--badge-bg-color);
  color: var(--badge-text-color);
  border: 1px solid var(--badge-border-color);
  font-family: 'Courier New', Courier, monospace; /* O tu var(--font-accent) */
  font-size: 0.8rem; /* Ligeramente más grande */
  font-weight: 500;
  padding: 4px 10px;
  margin: 4px;
  border-radius: 3px; /* Bordes ligeramente redondeados */
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.8px; /* Un poco más espaciado */
  user-select: none;
  position: relative; /* Necesario para el overlay de glitch */
  overflow: hidden; /* Para contener el glitch */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;

  /* Aplicar el brillo base */
  text-shadow: 0 0 3px var(--badge-glow-color);
  animation: text-flicker-subtle 5s linear infinite alternate; /* Animación sutil constante */
}

.skill-icon {
  /* Estilos base para el icono */
  width: 1em; /* Ajustar tamaño relativo a la fuente */
  height: 1em;
  /* El color se hereda (currentColor) o se puede forzar */
  color: var(--badge-text-color);
  /* Aseguramos que el fill del SVG también tome el color */
  fill: currentColor;
  flex-shrink: 0; /* Evita que el icono se encoja */
}

.skill-name {
  position: relative; /* Para estar sobre el glitch */
  z-index: 1;
}

/* --- Efecto Hover Mejorado --- */
.skill-badge-enhanced:hover {
  background-color: var(--badge-hover-bg-color);
  border-color: var(--badge-hover-border-color);
  color: #ffffff; /* Texto más brillante al pasar el ratón */
  text-shadow:
    0 0 5px var(--badge-glow-color),
    0 0 10px var(--badge-glow-color); /* Glow más intenso */
  box-shadow: 0 0 8px var(--badge-glow-color); /* Sombra exterior */
  cursor: default; /* O 'pointer' si lleva a algún sitio */
  animation-play-state: paused; /* Pausar animación base en hover */
}

/* --- Efecto Glitch (Opcional y Sutil) --- */
.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: inherit; /* Hereda padding para alinearse */
  font: inherit; /* Hereda fuente */
  letter-spacing: inherit;
  text-transform: inherit;
  white-space: inherit;
  pointer-events: none; /* No interfiere con el ratón */
  z-index: 0;
  opacity: 0.8;
}

.skill-badge-enhanced:hover .glitch-overlay {
  /* Desactivar glitch en hover para que no distraiga */
  display: none;
}

/* Animación para el glitch */
@keyframes glitch-animation {
  0% {
    clip-path: inset(30% 0 60% 0);
    transform: translateX(-2px);
    color: var(--retro-accent, #ff7f50);
  } /* Usa color de acento */
  5% {
    clip-path: inset(80% 0 10% 0);
    transform: translateX(2px);
  }
  10% {
    clip-path: inset(10% 0 75% 0);
    transform: translateX(-2px);
  }
  15% {
    clip-path: inset(50% 0 40% 0);
    transform: translateX(2px);
    color: var(--badge-text-color);
  } /* Vuelve a color normal */
  20% {
    clip-path: inset(90% 0 5% 0);
    transform: translateX(-2px);
  }
  25% {
    clip-path: initial;
    transform: initial;
  } /* Reset */
  100% {
    clip-path: initial;
    transform: initial;
  } /* Mantener reseteado */
}

.glitch-overlay {
  /* Aplicar la animación de forma infrecuente */
  animation: glitch-animation 6s infinite linear alternate-reverse;
}

/* --- Animación Sutil de Parpadeo de Texto --- */
@keyframes text-flicker-subtle {
  0%,
  15%,
  20%,
  23%,
  48%,
  52%,
  88%,
  92%,
  100% {
    text-shadow: 0 0 2px var(--badge-glow-color); /* Glow más tenue */
    opacity: 1;
  }
  18%,
  22%,
  50%,
  90% {
    text-shadow: none;
    opacity: 0.9; /* Ligera bajada de opacidad */
  }
}
</style>
