<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import CollapsiblePanel from '@/components/shared/CollapsiblePanel.vue'

const ui = useUiStore()
</script>

<template>
  <CollapsiblePanel
    title="¿Cómo funciona esto?"
    :model-value="ui.panelsOpen.howItWorks"
    @update:model-value="ui.togglePanel('howItWorks')"
  >
    <div class="flex flex-col gap-2 text-sm leading-relaxed text-ink-muted">
      <p>
        Cada <strong class="text-ink">aportante de ingreso</strong> puede tener uno o varios incrementos salariales:
        el sueldo vigente en un mes es el del incremento más reciente que ya haya empezado.
      </p>
      <p>
        Un <strong class="text-ink">evento planeado</strong> es cualquier compra, venta o ingreso puntual (una moto,
        un viaje, la venta de un carro), con la opción de repartirlo en cuotas. Un
        <strong class="text-ink">imprevisto</strong> es lo mismo pero no planeado: se paga primero con el fondo de
        imprevistos, y si no alcanza, el faltante sale de la caja de ese mes.
      </p>
      <p>
        Cada mes, si sobra caja por encima de tu <strong class="text-ink">colchón mínimo</strong>, el porcentaje que
        definas de ese excedente se destina a pagar deuda extra — siempre a la deuda con la
        <strong class="text-ink">tasa más alta primero</strong> (avalancha), y lo que sobre pasa a la siguiente.
      </p>
      <p>
        Al final, cada mes queda registrado con su ingreso, gastos, aportes, pagos de deuda y caja resultante, para
        que veas exactamente cómo llegaste a cada número.
      </p>
    </div>
  </CollapsiblePanel>
</template>
