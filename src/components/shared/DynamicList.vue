<script setup lang="ts" generic="T extends { id: string }">
defineProps<{
  items: T[]
  addLabel: string
  emptyMessage: string
}>()
defineEmits<{ add: [] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <TransitionGroup
      tag="div"
      class="flex flex-col gap-3"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
      move-class="transition duration-200"
    >
      <div v-for="(item, index) in items" :key="item.id">
        <slot :item="item" :index="index" />
      </div>
    </TransitionGroup>

    <p
      v-if="items.length === 0"
      class="rounded-lg border border-dashed border-surface-border px-3 py-4 text-center text-sm text-ink-faint"
    >
      {{ emptyMessage }}
    </p>

    <button
      type="button"
      class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-surface-border px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-cash hover:text-cash"
      @click="$emit('add')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
      </svg>
      {{ addLabel }}
    </button>
  </div>
</template>
