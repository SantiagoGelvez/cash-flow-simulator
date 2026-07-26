<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  id?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function onInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', Number.isFinite(value) ? value : 0)
}
</script>

<template>
  <input
    :id="id"
    type="number"
    :min="min"
    :max="max"
    :step="step ?? 1"
    class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 font-mono text-sm text-ink font-tabular focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>
