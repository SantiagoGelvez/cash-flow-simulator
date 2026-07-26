<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string
    hint?: string
    tone?: 'cash' | 'debt' | 'alert' | 'neutral'
  }>(),
  { tone: 'neutral', hint: '' },
)

const toneClasses: Record<string, string> = {
  cash: 'text-cash',
  debt: 'text-debt',
  alert: 'text-alert',
  neutral: 'text-ink',
}
</script>

<template>
  <div class="rounded-xl border border-surface-border bg-surface-raised p-4 shadow-card">
    <p class="text-xs font-medium text-ink-muted">{{ label }}</p>
    <p class="mt-1 font-mono text-xl font-semibold font-tabular" :class="toneClasses[tone]">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-ink-faint">{{ hint }}</p>
  </div>
</template>
