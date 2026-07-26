<script setup lang="ts">
import { ref } from 'vue'
import { useScenarioStore } from '@/stores/scenario'
import { downloadTextFile } from '@/composables/useCsvExport'

const store = useScenarioStore()
const fileInput = ref<HTMLInputElement | null>(null)

function exportJson() {
  const json = store.exportScenarioJSON()
  const filename = `escenario-${store.scenario.nombre.replace(/\s+/g, '-').toLowerCase()}.json`
  downloadTextFile(filename, json, 'application/json;charset=utf-8;')
}

function triggerImport() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const text = await file.text()
  store.importScenarioJSON(text)
  input.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
        @click="exportJson"
      >
        Exportar JSON
      </button>
      <button
        type="button"
        class="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
        @click="triggerImport"
      >
        Importar JSON
      </button>
      <input ref="fileInput" type="file" accept="application/json" class="hidden" @change="onFileSelected" />
    </div>
    <p v-if="store.importError" class="text-xs text-alert">{{ store.importError }}</p>
  </div>
</template>
