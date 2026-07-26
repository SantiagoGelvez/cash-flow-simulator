<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatNumber, parseCurrencyInput } from '@/composables/useCurrency'

const props = defineProps<{
  modelValue: number
  placeholder?: string
  id?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const focused = ref(false)
const rawText = ref(String(props.modelValue || ''))

watch(
  () => props.modelValue,
  (value) => {
    if (!focused.value) rawText.value = formatNumber(value)
  },
)

const displayValue = computed(() => (focused.value ? rawText.value : formatNumber(props.modelValue)))

function onFocus(event: FocusEvent) {
  focused.value = true
  rawText.value = props.modelValue ? String(props.modelValue) : ''
  const target = event.target as HTMLInputElement
  requestAnimationFrame(() => target.select())
}

function onInput(event: Event) {
  rawText.value = (event.target as HTMLInputElement).value
}

function onBlur() {
  focused.value = false
  const parsed = parseCurrencyInput(rawText.value)
  emit('update:modelValue', parsed)
  rawText.value = formatNumber(parsed)
}
</script>

<template>
  <input
    :id="id"
    type="text"
    inputmode="numeric"
    class="w-full rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 font-mono text-sm text-ink font-tabular placeholder:text-ink-faint focus:border-cash focus:outline-none focus:ring-1 focus:ring-cash"
    :value="displayValue"
    :placeholder="placeholder"
    @focus="onFocus"
    @input="onInput"
    @blur="onBlur"
  />
</template>
