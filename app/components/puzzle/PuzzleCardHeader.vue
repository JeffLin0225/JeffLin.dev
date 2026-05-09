<template>
  <div class="flex items-center gap-2 mb-4">
    <div class="flex gap-1.5">
      <span class="w-2 h-2 rounded-full bg-text-muted/20" />
      <span class="w-2 h-2 rounded-full bg-text-muted/20" />
      <span class="w-2 h-2 rounded-full bg-text-muted/20" />
    </div>
    <span class="font-mono text-xs text-text-muted/60 ml-1">{{ filename }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filename: string
}>()
</script>
