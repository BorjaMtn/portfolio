<script setup>
import { onMounted } from 'vue' // 1. Importa onMounted
import LabInterface from './components/LabInterface.vue'
import { useContentStore } from '@/stores/content' // 2. Importa tu store de contenido

// 3. Inicializa el store de contenido
const contentStore = useContentStore()

// 4. Llama a la acción loadContent() cuando el componente App.vue se monte por primera vez
onMounted(() => {
  contentStore.loadContent()
})
</script>

<template>
  <LabInterface />
</template>

<style scoped>
/* Estilos si los tienes */
</style>
