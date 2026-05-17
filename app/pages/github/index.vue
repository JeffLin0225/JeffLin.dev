<template>
  <div>
    <UiLoadingOverlay :visible="isLoading" />

    <!-- Search Hero -->
    <GithubSearchHero
      v-model="searchQuery"
      :suggestions="suggestions"
      :languages="availableLanguages"
      :selected-languages="selectedLanguages"
      :total-count="repos.length"
      @toggle-language="toggleLanguage"
      @select-repo="onSelectRepo"
    />

    <!-- Repo Grid or Empty State -->
    <GithubRepoGrid
      v-if="filteredRepos.length > 0"
      :repos="filteredRepos"
      :has-active-filter="hasActiveFilter"
      @clear-filters="clearFilters"
    />
    <GithubEmptyState
      v-else-if="!isLoading && repos.length > 0"
      @search="onSuggestionSearch"
    />
    <GithubEmptyState
      v-else-if="!isLoading && repos.length === 0"
      :no-data="true"
    />
  </div>
</template>

<script setup lang="ts">
import type { GitHubRepo } from '~/server/utils/github'

/* ─── SEO ─── */
useSeoMeta({
  title: 'GitHub — Jeff Lin',
  description: 'Explore my open-source projects on GitHub. Search and discover repositories.',
  ogTitle: 'Jeff Lin — GitHub Projects',
  ogDescription: 'Browse and search my GitHub repositories.',
})

/* ─── Data ─── */
const {
  repos,
  searchQuery,
  selectedLanguages,
  isLoading,
  suggestions,
  filteredRepos,
  availableLanguages,
  fetchRepos,
  toggleLanguage,
  clearFilters,
} = useGithubRepos()

await fetchRepos()

/* ─── Computed ─── */
const hasActiveFilter = computed(
  () => searchQuery.value.trim().length > 0 || selectedLanguages.value.length > 0,
)

/* ─── Handlers ─── */
const onSelectRepo = (repo: GitHubRepo) => {
  searchQuery.value = repo.name
}

const onSuggestionSearch = (query: string) => {
  searchQuery.value = query
}
</script>
