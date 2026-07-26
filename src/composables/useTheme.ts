import { ref, watch } from 'vue'
import { readLocalStorage, writeLocalStorage } from './useLocalStorage'

export type Theme = 'dark' | 'light'

const THEME_KEY = 'cfs:theme'

const theme = ref<Theme>(readLocalStorage(THEME_KEY, 'dark'))

function applyTheme(value: Theme) {
  document.documentElement.classList.toggle('light', value === 'light')
}

applyTheme(theme.value)

watch(theme, (value) => {
  applyTheme(value)
  writeLocalStorage(THEME_KEY, value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(value: Theme) {
    theme.value = value
  }

  return { theme, toggleTheme, setTheme }
}
