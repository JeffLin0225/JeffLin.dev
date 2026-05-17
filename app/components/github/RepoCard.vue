<template>
  <a
    :href="repo.html_url"
    target="_blank"
    rel="noopener noreferrer"
    class="repo-card group"
    :style="{ animationDelay: `${index * 50}ms` }"
  >
    <!-- Top accent bar (language color) -->
    <div
      class="accent-bar"
      :style="{ background: getLanguageColor(repo.language) }"
    />

    <div class="card-body">
      <!-- Repo name -->
      <h3 class="font-mono text-base font-medium text-text-primary mb-2 truncate transition-colors duration-normal group-hover:text-white">
        {{ repo.name }}
      </h3>

      <!-- Description -->
      <p class="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {{ repo.description || '暫無描述' }}
      </p>

      <!-- Meta info -->
      <div class="flex items-center justify-between text-xs text-text-muted mt-auto">
        <div class="flex items-center gap-1.5">
          <span
            v-if="repo.language"
            class="w-2.5 h-2.5 rounded-full flex-shrink-0"
            :style="{ background: getLanguageColor(repo.language) }"
          />
          <span>{{ repo.language || 'N/A' }}</span>
        </div>
        <span class="font-mono">{{ formattedDate }}</span>
      </div>

      <!-- GitHub link indicator -->
      <div class="flex items-center gap-1.5 mt-3 text-xs text-text-muted transition-[color,transform] duration-fast group-hover:text-text-primary">
        <span>View on GitHub</span>
        <span class="transition-transform duration-fast group-hover:translate-x-0.5">→</span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { GitHubRepo } from '~/server/utils/github'

const props = defineProps<{
  repo: GitHubRepo
  index: number
}>()

const formattedDate = computed(() => {
  const d = new Date(props.repo.updated_at)
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
})

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Dockerfile: '#384d54',
}

const getLanguageColor = (lang: string | null): string => {
  if (!lang) return '#8b8b8b'
  return languageColors[lang] || '#8b8b8b'
}
</script>

<style scoped>
.repo-card {
  display: block;
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  overflow: hidden;
  text-decoration: none;
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition:
    border-color 300ms ease,
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 300ms ease;
}
.repo-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px hsla(0, 0%, 0%, 0.4);
}
.repo-card:active {
  transform: translateY(-2px) scale(0.98);
}

/* Top accent bar */
.accent-bar {
  height: 3px;
  width: 30%;
  transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.repo-card:hover .accent-bar {
  width: 100%;
}

/* Gradient top line on hover */
.repo-card::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}
.repo-card:hover::before {
  opacity: 1;
}

.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 3px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
