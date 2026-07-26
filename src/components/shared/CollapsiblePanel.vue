<script setup lang="ts">
defineProps<{ title: string; modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <section class="rounded-xl border border-surface-border bg-surface-raised shadow-card">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      :aria-expanded="modelValue"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <h3 class="font-display text-base font-medium text-ink">{{ title }}</h3>
      <svg
        class="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200"
        :class="{ 'rotate-180': modelValue }"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="modelValue ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="px-4 pb-4 pt-1">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
