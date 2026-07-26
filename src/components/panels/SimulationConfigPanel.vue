<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import NumberField from '@/components/shared/NumberField.vue'

const store = useScenarioStore()
const ui = useUiStore()

function onMesesInput(value: number) {
  const clamped = Math.min(60, Math.max(6, Math.round(value) || 6))
  store.updateSettings({ mesesSimulacion: clamped })
}
</script>

<template>
  <CollapsiblePanel
    title="Configuración de la simulación"
    :model-value="ui.panelsOpen.simulationConfig"
    @update:model-value="ui.togglePanel('simulationConfig')"
  >
    <label class="mb-1 block text-xs font-medium text-ink-muted" for="meses-simulacion">
      Meses a simular (entre 6 y 60)
    </label>
    <NumberField
      id="meses-simulacion"
      :model-value="store.scenario.settings.mesesSimulacion"
      :min="6"
      :max="60"
      @update:model-value="onMesesInput"
    />
  </CollapsiblePanel>
</template>
