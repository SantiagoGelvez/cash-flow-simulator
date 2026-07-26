<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'

const store = useScenarioStore()

function loadExample() {
  if (window.confirm('Esto reemplaza el escenario actual con un ejemplo genérico. ¿Continuar?')) {
    store.loadExample()
  }
}

function startFromScratch() {
  if (window.confirm('Esto borra todos los datos del escenario actual. ¿Continuar?')) {
    store.resetToEmpty()
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
      @click="loadExample"
    >
      Cargar ejemplo
    </button>
    <button
      type="button"
      class="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-alert hover:text-alert"
      @click="startFromScratch"
    >
      Empezar de cero
    </button>
  </div>
</template>
