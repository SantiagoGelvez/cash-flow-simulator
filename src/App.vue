<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import ScenariosPanel from '@/components/panels/ScenariosPanel.vue'
import StartingPointPanel from '@/components/panels/StartingPointPanel.vue'
import IncomeSourcesPanel from '@/components/panels/IncomeSourcesPanel.vue'
import FixedExpenseAndFundPanel from '@/components/panels/FixedExpenseAndFundPanel.vue'
import DebtsPanel from '@/components/panels/DebtsPanel.vue'
import PlannedEventsPanel from '@/components/panels/PlannedEventsPanel.vue'
import ExtraPaydownStrategyPanel from '@/components/panels/ExtraPaydownStrategyPanel.vue'
import SimulationConfigPanel from '@/components/panels/SimulationConfigPanel.vue'
import HowItWorksPanel from '@/components/panels/HowItWorksPanel.vue'
import SummaryCards from '@/components/results/SummaryCards.vue'
import CriticalMonthAlert from '@/components/results/CriticalMonthAlert.vue'
import CashFlowChart from '@/components/charts/CashFlowChart.vue'
import DebtChart from '@/components/charts/DebtChart.vue'
import MonthlyTable from '@/components/table/MonthlyTable.vue'
import { useScenarioStore } from '@/stores/scenario'
import { useUiStore } from '@/stores/ui'

const store = useScenarioStore()
const ui = useUiStore()
</script>

<template>
  <AppShell>
    <template #panels>
      <ScenariosPanel />
      <StartingPointPanel />
      <IncomeSourcesPanel />
      <FixedExpenseAndFundPanel />
      <DebtsPanel />
      <PlannedEventsPanel />
      <ExtraPaydownStrategyPanel />
      <SimulationConfigPanel />
      <HowItWorksPanel />
    </template>
    <template #results>
      <SummaryCards />
      <CriticalMonthAlert />
      <CashFlowChart :key="`cash-${ui.theme}`" :meses="store.simulation.meses" />
      <DebtChart :key="`debt-${ui.theme}`" :meses="store.simulation.meses" :hitos="store.simulation.hitos" />
      <MonthlyTable />
    </template>
  </AppShell>
</template>
