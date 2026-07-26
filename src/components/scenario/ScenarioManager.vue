<script setup lang="ts">
import { computed, ref } from 'vue'
import { useScenarioStore } from '@/stores/scenario'
import ConfirmDeleteButton from '@/components/shared/ConfirmDeleteButton.vue'

const store = useScenarioStore()

const savingAs = ref(false)
const nuevoNombre = ref('')

const savedScenarios = computed(() =>
  Object.values(store.library).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
)

function startSaveAs() {
  nuevoNombre.value = store.scenario.nombre
  savingAs.value = true
}

function confirmSaveAs() {
  const nombre = nuevoNombre.value.trim()
  if (!nombre) return
  store.saveScenarioAs(nombre)
  savingAs.value = false
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <label class="mb-1 block text-xs font-medium text-ink-muted" for="nombre-escenario">
        Nombre de este escenario
      </label>
      <input
        id="nombre-escenario"
        type="text"
        class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        :value="store.scenario.nombre"
        @input="(e) => store.updateScenarioName((e.target as HTMLInputElement).value)"
      />
    </div>

    <div v-if="!savingAs">
      <button
        type="button"
        class="rounded-lg border border-dashed border-surface-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
        @click="startSaveAs"
      >
        Guardar como plan nuevo
      </button>
    </div>
    <div v-else class="flex items-center gap-2">
      <input
        v-model="nuevoNombre"
        type="text"
        class="min-w-0 flex-1 rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-sm text-ink focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
        placeholder="Ej. Plan A"
        @keydown.enter="confirmSaveAs"
      />
      <button
        type="button"
        class="shrink-0 rounded-lg border border-cash px-3 py-1.5 text-xs font-medium text-cash"
        @click="confirmSaveAs"
      >
        Guardar
      </button>
      <button
        type="button"
        class="shrink-0 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-faint"
        @click="savingAs = false"
      >
        Cancelar
      </button>
    </div>

    <div v-if="savedScenarios.length > 0" class="flex flex-col gap-2">
      <p class="text-[11px] uppercase tracking-wide text-ink-faint">Planes guardados</p>
      <div
        v-for="saved in savedScenarios"
        :key="saved.id"
        class="flex flex-col gap-2 rounded-lg border border-surface-border bg-surface-sunken/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="min-w-0">
          <p class="truncate text-sm text-ink">{{ saved.nombre }}</p>
          <p class="whitespace-nowrap text-[11px] text-ink-faint">Actualizado {{ formatDate(saved.updatedAt) }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            class="rounded-lg border border-surface-border px-2 py-1 text-xs font-medium text-ink-muted hover:border-cash hover:text-cash"
            @click="store.loadScenarioFromLibrary(saved.id)"
          >
            Cargar
          </button>
          <button
            type="button"
            class="rounded-lg border border-surface-border px-2 py-1 text-xs font-medium text-ink-muted hover:border-cash hover:text-cash"
            @click="store.duplicateInLibrary(saved.id)"
          >
            Duplicar
          </button>
          <ConfirmDeleteButton @confirm="store.deleteFromLibrary(saved.id)" />
        </div>
      </div>
    </div>
  </div>
</template>
