<script setup lang="ts">
import { computed } from 'vue'
import { useScenarioStore } from '@/stores/scenario'
import { buildCriticalMonthAlert } from '@/composables/useCriticalMonthAlert'

const store = useScenarioStore()

const alert = computed(() => buildCriticalMonthAlert(store.simulation, store.scenario.settings))

const toneClasses: Record<string, string> = {
  critical: 'border-alert/40 bg-alert-soft text-alert',
  warning: 'border-cash/40 bg-cash-soft text-cash',
  ok: 'border-debt/40 bg-debt-soft text-debt',
}
</script>

<template>
  <div class="flex items-start gap-3 rounded-xl border p-4" :class="toneClasses[alert.level]">
    <svg v-if="alert.level === 'critical'" class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.169 2.63-1.514 2.63H3.72c-1.345 0-2.187-1.463-1.514-2.63L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
    </svg>
    <svg v-else-if="alert.level === 'warning'" class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
    <svg v-else class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
    <div class="text-sm">
      <p class="font-medium">{{ alert.title }}</p>
      <p class="mt-1 leading-relaxed text-ink-muted">{{ alert.message }}</p>
    </div>
  </div>
</template>
