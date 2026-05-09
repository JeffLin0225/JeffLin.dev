<template>
  <Transition name="loading-overlay">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
      style="background: hsla(0, 0%, 4%, 0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
      aria-label="Loading"
      role="status"
    >
      <!-- Orbit Constellation (default) -->
      <div v-if="mode === 'orbit'" class="relative w-[108px] h-[108px]">
        <!-- Ring 1 — outer -->
        <div class="orbit-ring absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-white/50 animate-orbit-1">
          <div class="orbit-dot absolute top-[-2px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_hsla(0,0%,100%,0.5)]" />
        </div>
        <!-- Ring 2 — middle -->
        <div class="orbit-ring absolute inset-3 rounded-full border-[1.5px] border-transparent border-r-white/30 animate-orbit-2">
          <div class="orbit-dot absolute right-[-2px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_hsla(0,0%,100%,0.5)]" />
        </div>
        <!-- Ring 3 — inner -->
        <div class="orbit-ring absolute inset-6 rounded-full border-[1.5px] border-transparent border-b-white/15 animate-orbit-3">
          <div class="orbit-dot absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_hsla(0,0%,100%,0.5)]" />
        </div>
      </div>

      <!-- Pulse Line (alternative) -->
      <div v-else-if="mode === 'pulse'" class="relative w-[180px] h-[40px]">
        <div class="absolute top-1/2 left-0 right-0 h-px bg-border-subtle" />
        <div class="absolute top-1/2 -translate-y-1/2 w-[60px] h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse-slide" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
          <div class="w-[5px] h-[5px] rounded-full bg-white/20 animate-pulse-beat" />
          <div class="w-[5px] h-[5px] rounded-full bg-white/20 animate-pulse-beat" style="animation-delay: 0.3s;" />
          <div class="w-[5px] h-[5px] rounded-full bg-white/20 animate-pulse-beat" style="animation-delay: 0.6s;" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  mode?: 'orbit' | 'pulse'
}

withDefaults(defineProps<Props>(), {
  mode: 'orbit',
})
</script>

<style scoped>
.loading-overlay-enter-active,
.loading-overlay-leave-active {
  transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
}
</style>
