import { reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { readLocalStorage, writeLocalStorage } from '@/composables/useLocalStorage'
import { useTheme } from '@/composables/useTheme'

const UI_KEY = 'cfs:ui'

export type PanelKey =
  | 'startingPoint'
  | 'incomeSources'
  | 'fixedExpenseFund'
  | 'debts'
  | 'plannedEvents'
  | 'strategy'
  | 'simulationConfig'
  | 'scenarios'
  | 'howItWorks'

const defaultPanelState: Record<PanelKey, boolean> = {
  startingPoint: true,
  incomeSources: true,
  fixedExpenseFund: true,
  debts: true,
  plannedEvents: true,
  strategy: true,
  simulationConfig: true,
  scenarios: false,
  howItWorks: false,
}

export const useUiStore = defineStore('ui', () => {
  const { theme, toggleTheme, setTheme } = useTheme()

  const panelsOpen = reactive<Record<PanelKey, boolean>>({
    ...defaultPanelState,
    ...readLocalStorage(UI_KEY, {}),
  })

  watch(panelsOpen, (value) => writeLocalStorage(UI_KEY, value), { deep: true })

  function togglePanel(key: PanelKey) {
    panelsOpen[key] = !panelsOpen[key]
  }

  return { theme, toggleTheme, setTheme, panelsOpen, togglePanel }
})
