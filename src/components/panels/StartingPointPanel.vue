<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'

const store = useScenarioStore()
const ui = useUiStore()
</script>

<template>
  <CollapsiblePanel
    title="Punto de partida"
    :model-value="ui.panelsOpen.startingPoint"
    @update:model-value="ui.togglePanel('startingPoint')"
  >
    <label class="mb-1 block text-xs font-medium text-ink-muted" for="caja-inicial">
      Caja inicial (lo que ya tienes ahorrado hoy)
    </label>
    <CurrencyInput
      id="caja-inicial"
      :model-value="store.scenario.settings.cajaInicial"
      @update:model-value="(v) => store.updateSettings({ cajaInicial: v })"
    />
  </CollapsiblePanel>
</template>
