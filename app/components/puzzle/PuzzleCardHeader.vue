<template>
  <div class="flex items-center gap-2 mb-4">
    <div class="flex gap-1.5">
      <span class="w-2 h-2 rounded-full bg-text-muted/20 transition-[background-color,box-shadow] duration-300 group-hover:bg-accent-nuxt group-hover:shadow-[0_0_6px_rgba(0,220,130,0.5)]" />
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
