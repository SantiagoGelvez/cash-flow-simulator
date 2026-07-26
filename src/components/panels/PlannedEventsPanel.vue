<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import DynamicList from '@/components/shared/DynamicList.vue'
import PlannedEventRow from './PlannedEventRow.vue'

const store = useScenarioStore()
const ui = useUiStore()

function addEvent() {
  store.addPlannedEvent({ nombre: '', tipo: 'gasto', monto: 0, mes: 1, cuotas: 1 })
}
</script>

<template>
  <CollapsiblePanel
    title="Eventos planeados"
    :model-value="ui.panelsOpen.plannedEvents"
    @update:model-value="ui.togglePanel('plannedEvents')"
  >
    <p class="mb-3 text-xs text-ink-faint">
      Cualquier compra, venta o ingreso puntual: una moto, un viaje, la venta de un activo, lo que sea.
    </p>
    <DynamicList
      :items="store.scenario.plannedEvents"
      add-label="Agregar evento"
      empty-message="Sin eventos planeados todavía."
      @add="addEvent"
    >
      <template #default="{ item }">
        <PlannedEventRow
          :event="item"
          @update="(patch) => store.updatePlannedEvent(item.id, patch)"
          @remove="store.removePlannedEvent(item.id)"
        />
      </template>
    </DynamicList>
  </CollapsiblePanel>
</template>
