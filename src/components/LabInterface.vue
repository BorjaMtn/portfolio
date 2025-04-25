<script setup>
import InteractiveElement from './InteractiveElement.vue'
import ContentDisplay from './ContentDisplay.vue'
import { useUiStore } from '@/stores/ui' // Ajusta la ruta si es necesario

const uiStore = useUiStore()

function handleSectionActivation(sectionId) {
  uiStore.setActiveSection(sectionId)
  // console.log('Sección activada:', sectionId); // Puedes quitar o dejar este log
}
</script>

<template>
  <div class="lab-container">
    <aside class="lab-sidebar">
      <h1 class="sidebar-title">LAB_OS</h1>
      <nav>
        <InteractiveElement
          sectionId="about"
          label="Sobre Mí // SYS_INFO"
          @activate="handleSectionActivation"
        />
        <InteractiveElement
          sectionId="skills"
          label="Habilidades // SKL_MATRIX"
          @activate="handleSectionActivation"
        />
        <InteractiveElement
          sectionId="projects"
          label="Proyectos // PRJ_ARCHIVE"
          @activate="handleSectionActivation"
        />
        <InteractiveElement
          sectionId="contact"
          label="Contacto // COM_LINK"
          @activate="handleSectionActivation"
        />
        <InteractiveElement
          sectionId="cv"
          label="Descargar CV // GET_FILE"
          @activate="handleSectionActivation"
        />
      </nav>
    </aside>
    <main class="lab-main-content">
      <ContentDisplay />
    </main>
  </div>
</template>

<style scoped>
.lab-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  /* Usamos la variable de fondo definida en :root (main.css) */
  background-color: var(--color-background);
  color: var(--color-text-primary);
  overflow: hidden;
}

.lab-sidebar {
  width: 240px; /* Ajustamos un poco el ancho */
  flex-shrink: 0;
  padding: 25px 15px;
  /* Usamos un color de superficie ligeramente distinto para la sidebar */
  background-color: var(--color-surface-1);
  /* Usamos el color de borde definido */
  border-right: 1px solid var(--color-border);
  overflow-y: auto; /* Mantenemos scroll por si hay muchos botones */
  display: flex; /* Usamos flex para ordenar el contenido interno (título + nav) */
  flex-direction: column;
}

/* Estilo opcional para un título en la sidebar */
.sidebar-title {
  font-family: var(--font-accent);
  color: var(--color-accent-purple); /* Usamos morado para el título? */
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Espacio entre botones */
}

.lab-main-content {
  flex-grow: 1;
  height: 100vh; /* Asegura altura */
  /* El scroll y padding ahora están en ContentDisplay.vue -> .content-area */
  /* No necesita background-color aquí, tomará el de .lab-container */
  box-sizing: border-box;
}
</style>
