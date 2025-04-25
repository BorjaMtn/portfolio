import { ref } from 'vue'
import { defineStore } from 'pinia'

// Importamos directamente los archivos JSON.
// Vite los manejará eficientemente durante el build.
// Asegúrate de que las rutas sean correctas según donde guardaste los JSON.
import projectsData from '@/assets/data/projects.json'
import skillsData from '@/assets/data/skills.json'

export const useContentStore = defineStore('content', () => {
  // === ESTADO (State) ===
  // Estado reactivo para almacenar los datos una vez cargados
  const projects = ref([])
  const skills = ref([])

  // === ACCIONES (Actions) ===
  // Acción para "cargar" los datos desde los archivos importados a nuestro estado
  // Como usamos importación directa, esta acción es síncrona.
  function loadContent() {
    console.log('Store Content: Cargando datos desde JSON importados...')
    projects.value = projectsData
    skills.value = skillsData
    console.log('Store Content: Datos cargados:', {
      projects: projects.value,
      skills: skills.value,
    })
  }

  // === GETTERS (Opcional) ===
  // Podríamos tener getters para filtrar proyectos por categoría, etc.

  // === RETURN ===
  // Exponemos el estado y la acción de carga
  return {
    projects,
    skills,
    loadContent,
  }
})
