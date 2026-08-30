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
      <h3 class="font-mono text-base font-medium text-text-primary mb-1.5 truncate transition-colors duration-normal group-hover:text-white">
        {{ repo.name }}
      </h3>

      <!-- Description -->
      <p class="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2 min-h-[2rem]">
        {{ repo.description || '暫無描述' }}
      </p>

      <!-- Topics -->
      <div v-if="repo.topics?.length" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="topic in repo.topics.slice(0, 4)"
          :key="topic"
          class="topic-tag"
        >
          <span class="topic-tag-hash" :style="{ color: getTopicColor(topic) }">#</span>{{ topic }}
        </span>
        <span v-if="repo.topics.length > 4" class="topic-tag topic-tag--more">
          +{{ repo.topics.length - 4 }}
        </span>
      </div>

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

const { getLanguageColor } = useLanguageColors()
const { getTopicColor } = useTopicColors()
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

/* ─── Topic Tags ─── */
.topic-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.0625rem;
  padding: 0.125rem 0.5rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--text-muted);
  background: hsla(0, 0%, 100%, 0.04);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  border-radius: 9999px;
  white-space: nowrap;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease;
}
.repo-card:hover .topic-tag {
  background: hsla(0, 0%, 100%, 0.07);
  border-color: hsla(0, 0%, 100%, 0.14);
  color: var(--text-secondary);
}

.topic-tag-hash {
  font-weight: 700;
  margin-right: 0.0625rem;
}

.topic-tag--more {
  color: var(--text-muted);
  font-family: var(--font-sans);
  letter-spacing: 0;
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
