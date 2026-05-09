<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-surface-primary px-6">
    <div class="text-center max-w-md">
      <!-- Error Code -->
      <h1 class="font-mono text-7xl font-bold text-text-primary mb-4">
        {{ error?.statusCode || 500 }}
      </h1>

      <!-- ASCII divider -->
      <div class="font-mono text-text-muted/30 text-sm mb-6" aria-hidden="true">
        ════════════════════
      </div>

      <!-- Message (user-friendly, no details) -->
      <p class="font-display text-xl text-text-secondary mb-2">
        {{ errorTitle }}
      </p>
      <p class="text-sm text-text-muted mb-10">
        {{ errorDescription }}
      </p>

      <!-- CTA -->
      <button
        id="error-go-home"
        class="px-6 py-3 border border-border-default rounded-sm font-display text-sm font-medium text-text-primary bg-transparent cursor-pointer transition-[border-color,background] duration-fast hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]"
        @click="handleError"
      >
        ← Back to Home
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
  if (props.error?.statusCode === 404) return '找不到頁面'
  return '發生了一些問題'
})

const errorDescription = computed(() => {
  if (props.error?.statusCode === 404) return '你要找的頁面可能已移除，或是網址有誤。'
  return '請稍後再試，或回到首頁重新開始。'
})

/* Log error details for debugging (will appear in Cloudflare logs) */
if (import.meta.server && props.error) {
  console.error('[Error Page]', {
    statusCode: props.error.statusCode,
    message: props.error.message,
    url: props.error.url,
    stack: props.error.stack,
  })
}

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
