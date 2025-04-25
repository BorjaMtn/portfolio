import { ref } from 'vue'
import { defineStore } from 'pinia'

// Usamos defineStore para crear nuestro store 'ui'
// El primer argumento es un ID único para el store ('ui')
// El segundo es una función de configuración (estilo setup store)
export const useUiStore = defineStore('ui', () => {
  // === ESTADO (State) ===
  // Definimos las piezas de estado reactivo usando ref()
  const activeSection = ref('about') // Sección activa por defecto al cargar
  const isLoading = ref(false) // Para indicar si algo está cargando (útil después)
  // Podríamos añadir más estado aquí si fuera necesario

  // === ACCIONES (Actions) ===
  // Definimos funciones que modifican el estado
  function setActiveSection(sectionId) {
    console.log('Store: Estableciendo sección activa a:', sectionId) // Log para depurar
    activeSection.value = sectionId
    // Podríamos poner isLoading a true aquí y luego a false tras un tiempo/carga
  }

  function setLoading(status) {
    isLoading.value = status
  }

  // === GETTERS (Opcional, como computed properties) ===
  // Podríamos definir getters si necesitáramos estado computado

  // === RETURN ===
  // Exponemos el estado y las acciones para que los componentes puedan usarlos
  return {
    activeSection,
    isLoading,
    setActiveSection,
    setLoading,
  }
})
