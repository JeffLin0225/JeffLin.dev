<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-surface-primary px-6">
    <div class="text-center max-w-md">
      <!-- Error Code -->
      <h1 class="font-mono text-6xl font-bold text-text-primary mb-4">
        {{ error?.statusCode || 500 }}
      </h1>

      <!-- ASCII divider -->
      <div class="font-mono text-text-muted/30 text-sm mb-6">
        ════════════════════
      </div>

      <!-- Message -->
      <p class="font-display text-lg text-text-secondary mb-2">
        {{ errorTitle }}
      </p>
      <p class="font-mono text-sm text-text-muted mb-8">
        {{ error?.message || 'An unexpected error occurred.' }}
      </p>

      <!-- Terminal prompt -->
      <div class="font-mono text-sm text-text-muted mb-8">
        <span class="text-text-secondary">$</span> suggest --fix
        <br />
        <span class="text-text-muted/60">&gt; Navigate back to a safe route.</span>
      </div>

      <!-- CTA -->
      <button
        id="error-go-home"
        class="px-6 py-3 border border-border-default rounded-sm font-display text-sm font-medium text-text-primary bg-transparent cursor-pointer transition-[border-color,background] duration-fast hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]"
        @click="handleError"
      >
        cd ~/home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorTitle = computed(() => {
  if (props.error?.statusCode === 404) return 'Page not found'
  return 'Something went wrong'
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
