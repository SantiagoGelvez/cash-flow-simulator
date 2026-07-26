<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-surface text-ink">
    <header class="border-b border-surface-border bg-surface-raised/60 backdrop-blur">
      <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <div class="min-w-0">
          <h1 class="truncate font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl">
            Simulador de Flujo de Caja
          </h1>
          <p class="hidden text-sm text-ink-muted sm:block">
            Modela tus ingresos, deudas y compras planeadas mes a mes.
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <slot name="header-actions" />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <div class="flex min-w-0 flex-col gap-4">
          <slot name="panels" />
        </div>
        <div class="flex min-w-0 flex-col gap-6">
          <slot name="results" />
        </div>
      </div>
    </main>
  </div>
</template>
