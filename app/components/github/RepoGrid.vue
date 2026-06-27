<template>
  <section id="repo-grid" class="pt-1 pb-4">
    <div class="container-main">
      <!-- Results count -->
      <div class="flex items-center gap-3 mb-6">
        <span class="font-mono text-xs text-text-primary/50">{{ String(repos.length).padStart(3, '0') }}</span>
        <span class="text-text-primary/70 text-sm">
          {{ hasActiveFilter ? '篩選結果' : '所有專案' }}
        </span>
        <div class="flex-1 h-px bg-white/15" />
      </div>

      <!-- Clear filters (centered, prominent) -->
      <div v-if="hasActiveFilter" class="flex justify-center mb-6">
        <button
          class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-display font-medium text-text-primary border border-white/30 rounded-full bg-white/[0.06] transition-all duration-200 hover:bg-white/[0.12] hover:border-white/50 hover:shadow-[0_0_12px_hsla(0,0%,100%,0.1)] cursor-pointer"
          @click="$emit('clearFilters')"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          清除所有篩選
        </button>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <GithubRepoCard
          v-for="(repo, idx) in repos"
          :key="repo.name"
          :repo="repo"
          :index="idx"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GitHubRepo } from '~/server/utils/github'

defineProps<{
  repos: GitHubRepo[]
  hasActiveFilter: boolean
}>()

defineEmits<{
  'clearFilters': []
}>()
</script>
