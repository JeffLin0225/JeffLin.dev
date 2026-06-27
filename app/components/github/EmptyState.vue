<template>
  <div class="container-main py-16">
    <div class="flex flex-col items-center justify-center text-center animate-fade-in">
      <!-- Icon -->
      <div class="w-16 h-16 mb-6 flex items-center justify-center rounded-full border border-border-subtle bg-surface-secondary">
        <svg class="w-7 h-7 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
      </div>

      <!-- Message -->
      <h3 class="font-display text-lg font-semibold text-text-primary mb-2">
        {{ noData ? '尚無專案資料' : '找不到符合的專案' }}
      </h3>
      <p class="text-text-secondary text-sm mb-6 max-w-sm">
        <template v-if="noData">
          資料尚未同步，請稍後再試。
        </template>
        <template v-else>
          試試其他關鍵字，或點擊上方分類瀏覽
        </template>
      </p>

      <!-- Search suggestions -->
      <div v-if="!noData" class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-xs text-text-muted mr-1">推薦搜尋：</span>
        <button
          v-for="suggestion in defaultSuggestions"
          :key="suggestion"
          class="px-3 py-1 text-xs font-mono text-text-muted border border-border-subtle rounded-pill transition-[border-color,color] duration-fast hover:border-border-accent hover:text-text-primary cursor-pointer bg-transparent"
          @click="$emit('search', suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  noData?: boolean
}>()

defineEmits<{
  'search': [query: string]
}>()

const defaultSuggestions = ['TypeScript', 'Python', 'Vue', 'Java', 'API']
</script>
