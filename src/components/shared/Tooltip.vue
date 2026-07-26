<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

defineProps<{ text: string }>()

const open = ref(false)

function show() {
  open.value = true
}
function hide() {
  open.value = false
}
function toggle() {
  open.value = !open.value
}

function onDocumentClick(event: MouseEvent) {
  if (!(event.target instanceof Element) || !event.target.closest('[data-tooltip-root]')) {
    open.value = false
  }
}

document.addEventListener('click', onDocumentClick)
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <span class="relative inline-flex" data-tooltip-root @mouseenter="show" @mouseleave="hide">
    <button
      type="button"
      class="inline-flex h-4 w-4 items-center justify-center rounded-full border border-surface-border text-[10px] font-medium leading-none text-ink-faint hover:border-ink-faint hover:text-ink-muted"
      :aria-expanded="open"
      aria-label="Más información"
      @click.stop="toggle"
      @keydown.escape="hide"
    >
      ?
    </button>
    <span
      v-if="open"
      role="tooltip"
      class="absolute bottom-full left-1/2 z-20 mb-2 w-[min(16rem,80vw)] -translate-x-1/2 rounded-lg border border-surface-border bg-surface-sunken px-3 py-2 text-xs leading-snug text-ink-muted shadow-card"
    >
      {{ text }}
    </span>
  </span>
</template>
