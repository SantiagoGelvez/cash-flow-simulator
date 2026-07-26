<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'
import CurrencyInput from '@/components/shared/CurrencyInput.vue'
import Tooltip from '@/components/shared/Tooltip.vue'

const store = useScenarioStore()
const ui = useUiStore()
</script>

<template>
  <CollapsiblePanel
    title="Estrategia de abono extra"
    :model-value="ui.panelsOpen.strategy"
    @update:model-value="ui.togglePanel('strategy')"
  >
    <div class="flex flex-col gap-4">
      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <label class="text-xs font-medium text-ink-muted" for="pct-excedente">
            % del excedente mensual a abono extra
          </label>
          <Tooltip
            text="Del dinero que te sobra cada mes por encima de tu colchón mínimo, este porcentaje se destina a pagar deuda adicional (a la deuda con la tasa más alta primero)."
          />
        </div>
        <div class="flex items-center gap-3">
          <input
            id="pct-excedente"
            type="range"
            min="0"
            max="100"
            step="1"
            class="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-surface-sunken accent-cash"
            :value="store.scenario.settings.pctExcedenteAAbonoExtra"
            @input="(e) => store.updateSettings({ pctExcedenteAAbonoExtra: Number((e.target as HTMLInputElement).value) })"
          />
          <span class="w-12 shrink-0 text-right font-mono text-sm font-tabular text-ink">
            {{ store.scenario.settings.pctExcedenteAAbonoExtra }}%
          </span>
        </div>
      </div>

      <div>
        <div class="mb-1 flex items-center gap-1.5">
          <label class="text-xs font-medium text-ink-muted" for="colchon-minimo">Colchón mínimo</label>
          <Tooltip
            text="La caja que nunca se toca para pagar deuda extra, sin importar cuánto excedente haya ese mes. Es tu margen de seguridad."
          />
        </div>
        <CurrencyInput
          id="colchon-minimo"
          :model-value="store.scenario.settings.colchonMinimo"
          @update:model-value="(v) => store.updateSettings({ colchonMinimo: v })"
        />
      </div>
    </div>
  </CollapsiblePanel>
</template>
