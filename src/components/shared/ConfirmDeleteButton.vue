<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits<{ confirm: [] }>()

const armed = ref(false)
let timeoutHandle: ReturnType<typeof setTimeout> | undefined

function onClick() {
  if (armed.value) {
    if (timeoutHandle) clearTimeout(timeoutHandle)
    armed.value = false
    emit('confirm')
    return
  }
  armed.value = true
  timeoutHandle = setTimeout(() => {
    armed.value = false
  }, 2500)
}

onBeforeUnmount(() => {
  if (timeoutHandle) clearTimeout(timeoutHandle)
})
</script>

<template>
  <button
    type="button"
    class="shrink-0 whitespace-nowrap rounded-lg border px-2 py-1 text-xs font-medium transition-colors"
    :class="
      armed
        ? 'border-alert bg-alert-soft text-alert'
        : 'border-surface-border text-ink-faint hover:border-alert hover:text-alert'
    "
    @click="onClick"
  >
    {{ armed ? '¿Confirmar?' : 'Eliminar' }}
  </button>
</template>
