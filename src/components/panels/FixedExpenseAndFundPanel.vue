<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import DynamicList from '@/components/shared/DynamicList.vue'
import Tooltip from '@/components/shared/Tooltip.vue'
import ImprevistoRow from './ImprevistoRow.vue'

const store = useScenarioStore()
const ui = useUiStore()

function addImprevisto() {
  store.addImprevisto({ nombre: '', monto: 0, mes: 1 })
}
</script>

<template>
  <CollapsiblePanel
    title="Gasto fijo y fondo de imprevistos"
    :model-value="ui.panelsOpen.fixedExpenseFund"
    @update:model-value="ui.togglePanel('fixedExpenseFund')"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="mb-1 block text-xs font-medium text-ink-muted" for="gasto-fijo">
          Gasto fijo mensual del hogar
        </label>
        <CurrencyInput
          id="gasto-fijo"
          :model-value="store.scenario.settings.gastoFijoMensual"
          @update:model-value="(v) => store.updateSettings({ gastoFijoMensual: v })"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-ink-muted" for="aporte-fondo">
            Aporte mensual al fondo
          </label>
          <CurrencyInput
            id="aporte-fondo"
            :model-value="store.scenario.emergencyFund.aporteMensual"
            @update:model-value="(v) => store.updateEmergencyFundSettings({ aporteMensual: v })"
          />
        </div>
        <div>
          <div class="mb-1 flex items-center gap-1.5">
            <label class="block text-xs font-medium text-ink-muted" for="tope-fondo">Tope del fondo</label>
            <Tooltip
              text="El máximo que el fondo de imprevistos puede acumular. Una vez lo alcanza, el aporte mensual deja de descontarse de tu caja y queda libre para otras cosas."
            />
          </div>
          <CurrencyInput
            id="tope-fondo"
            :model-value="store.scenario.emergencyFund.tope"
            @update:model-value="(v) => store.updateEmergencyFundSettings({ tope: v })"
          />
        </div>
      </div>

      <div>
        <p class="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Imprevistos</p>
        <DynamicList
          :items="store.scenario.emergencyFund.imprevistos"
          add-label="Agregar imprevisto"
          empty-message="Sin imprevistos registrados."
          @add="addImprevisto"
        >
          <template #default="{ item }">
            <ImprevistoRow
              :imprevisto="item"
              @update="(patch) => store.updateImprevisto(item.id, patch)"
              @remove="store.removeImprevisto(item.id)"
            />
          </template>
        </DynamicList>
      </div>
    </div>
  </CollapsiblePanel>
</template>
