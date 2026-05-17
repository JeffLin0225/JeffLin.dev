<template>
  <section id="repo-grid" class="py-8">
    <div class="container-main">
      <!-- Results count -->
      <div class="flex items-center gap-3 mb-6">
        <span class="font-mono text-xs text-text-muted/40">{{ String(repos.length).padStart(3, '0') }}</span>
        <span class="text-text-secondary text-sm">
          {{ hasActiveFilter ? '篩選結果' : '所有專案' }}
        </span>
        <div class="flex-1 h-px bg-border-subtle" />
        <button
          v-if="hasActiveFilter"
          class="text-xs font-mono text-text-muted border border-border-subtle rounded-sm px-2 py-1 transition-[border-color,color] duration-fast hover:border-border-accent hover:text-text-primary cursor-pointer bg-transparent"
          @click="$emit('clearFilters')"
        >
          清除篩選
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
