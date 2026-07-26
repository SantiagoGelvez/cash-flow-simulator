<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import ScenarioManager from '@/components/scenario/ScenarioManager.vue'
import ScenarioImportExport from '@/components/scenario/ScenarioImportExport.vue'
import ExampleOrScratch from '@/components/scenario/ExampleOrScratch.vue'

const ui = useUiStore()
</script>

<template>
  <CollapsiblePanel
    title="Escenarios"
    :model-value="ui.panelsOpen.scenarios"
    @update:model-value="ui.togglePanel('scenarios')"
  >
    <div class="flex flex-col gap-4">
      <ExampleOrScratch />
      <div class="border-t border-surface-border pt-4">
        <ScenarioManager />
      </div>
      <div class="border-t border-surface-border pt-4">
        <p class="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Respaldo</p>
        <ScenarioImportExport />
      </div>
    </div>
  </CollapsiblePanel>
</template>
