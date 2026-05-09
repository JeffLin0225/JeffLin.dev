<template>
  <div class="flex items-center justify-between">
    <div class="flex gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="px-2.5 py-0.5 text-xs font-mono text-text-muted border border-border-subtle rounded-pill transition-[border-color,color] duration-150 group-hover:border-border-default group-hover:text-text-secondary"
      >
        {{ tag }}
      </span>
    </div>
    <span class="text-text-muted text-sm transition-[transform,color] duration-150 group-hover:text-text-primary group-hover:translate-x-1">
      →
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>
