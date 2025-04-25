<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui' // Ajusta ruta si es necesario

const props = defineProps({
  sectionId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'Botón',
  },
})

const emit = defineEmits(['activate'])

const uiStore = useUiStore()
const { activeSection } = storeToRefs(uiStore)

const isActive = computed(() => {
  return props.sectionId === activeSection.value
})

function handleClick() {
  emit('activate', props.sectionId)
}
</script>

<template>
  <button class="interactive-button" :class="{ active: isActive }" @click="handleClick">
    <span class="label-text">{{ label }}</span>
  </button>
</template>

<style scoped>
.interactive-button {
  display: flex; /* Cambiamos a flex para alinear mejor */
  align-items: center; /* Centra verticalmente el texto */
  width: 100%;
  padding: 10px 15px; /* Ajustamos padding */
  margin-bottom: 0;
  border: none;
  /* Borde izquierdo sutil en estado normal */
  border-left: 4px solid transparent; /* Más grueso pero transparente */
  /* Fondo sutil o transparente */
  background-color: transparent;
  /* Texto secundario en estado normal */
  color: var(--color-text-secondary);
  /* Fuente de acento (monoespaciada) */
  font-family: var(--font-accent);
  font-size: 0.9rem; /* Tamaño ajustado para monoespaciada */
  text-align: left;
  cursor: pointer;
  transition: var(--transition-base); /* Usamos la transición base */
  text-transform: uppercase; /* Todo mayúsculas para look consola */
  letter-spacing: 0.5px; /* Espaciado de letras */
}

.label-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* Ocupa el espacio disponible */
}

.interactive-button:hover,
.interactive-button:focus-visible {
  /* Usamos el color de hover definido */
  background-color: var(--color-hover-bg);
  /* Texto primario al pasar el ratón */
  color: var(--color-text-primary);
  outline: none;
  border-left-color: var(--color-border); /* Mostramos borde sutil gris */
}

/* --- Estilo ACTIVO Refinado --- */
.interactive-button.active {
  /* Mantenemos fondo sutil o lo quitamos */
  background-color: var(--color-hover-bg);
  /* Texto primario */
  color: var(--color-text-primary);
  font-weight: 600; /* Más grueso */
  /* El único uso del color de acento primario es aquí */
  border-left: 4px solid var(--color-accent-primary);
}
</style>
