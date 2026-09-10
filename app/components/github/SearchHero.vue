<template>
  <section id="github-search-hero" class="relative pt-12 pb-10 md:pt-16 md:pb-12">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 65% 45% at 50% 25%, hsla(0,0%,100%,0.03), transparent 70%)" />
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl" />
    </div>

    <div class="container-main relative z-10">
      <!-- Title -->
      <div class="text-center mb-8 animate-fade-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-surface-elevated/80 border border-border-subtle backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-xs font-mono text-text-secondary">Open Source Showcase</span>
          <span
            v-if="totalCount > 0"
            class="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.06] text-text-primary rounded-full"
          >
            {{ totalCount }} repos
          </span>
        </div>
        <h1 class="font-display text-3xl md:text-5xl font-bold tracking-tight mb-2">
          GitHub 專案搜尋器
        </h1>
        <p class="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
          探索技術棧領域聚類與開源專案，支援多維度標籤組合篩選
        </p>
      </div>

      <!-- Search input -->
      <div class="flex justify-center animate-fade-up stagger-2 mb-6" style="position: relative; z-index: 60;">
        <div class="relative w-full max-w-2xl" ref="searchWrapperRef">
          <div class="search-box" :class="{ 'search-box--focused': isFocused }">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="github-search-input"
              v-model="localQuery"
              type="text"
              placeholder="搜尋專案名稱、描述、語言..."
              autocomplete="off"
              class="search-input"
              @focus="isFocused = true"
              @blur="onBlur"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @keydown.enter.prevent="selectHighlighted"
              @keydown.escape="isFocused = false"
            />
            <button
              v-if="localQuery"
              class="clear-btn"
              @mousedown.prevent="clearSearch"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <Transition name="dropdown">
            <div v-if="isFocused && suggestions.length > 0" class="suggestions-dropdown">
              <button
                v-for="(repo, idx) in suggestions"
                :key="repo.name"
                class="suggestion-item"
                :class="{ 'suggestion-item--highlighted': highlightedIndex === idx }"
                @mousedown.prevent="selectSuggestion(repo)"
              >
                <svg class="w-4 h-4 text-text-muted flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span class="font-mono text-sm text-text-primary truncate">{{ repo.name }}</span>
                <span v-if="repo.language" class="flex items-center gap-1 ml-auto flex-shrink-0">
                  <span class="w-2 h-2 rounded-full" :style="{ background: getLanguageColor(repo.language) }" />
                  <span class="text-xs text-text-muted">{{ repo.language }}</span>
                </span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section animate-fade-up stagger-3">
        <!-- Language Pills -->
        <div v-if="allLanguages.length > 0" class="filter-group">
          <div class="filter-group-label">
            <svg class="w-3.5 h-3.5 label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20"/>
            </svg>
            <span class="label-title">Language</span>
            <span class="filter-hint">點擊篩選 Click to filter</span>
          </div>
          <div class="pills-row">
            <button
              v-for="lang in allLanguages"
              :key="lang.name"
              class="lang-pill"
              :class="{ 'lang-pill--active': isLangSelected(lang.name) }"
              @click="$emit('toggleLanguage', lang.name)"
            >
              <span class="lang-dot" :style="{ background: getLanguageColor(lang.name) }" />
              <span class="font-medium">{{ lang.name }}</span>
              <span class="pill-count">{{ lang.count }}</span>
            </button>
          </div>
        </div>

        <div v-if="allLanguages.length > 0 && allTopics.length > 0" class="filter-sep" />

        <!-- Topics -->
        <div v-if="allTopics.length > 0" class="filter-group">
          <div class="filter-group-label">
            <svg class="w-3.5 h-3.5 label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span class="label-title">Topics</span>
            <span class="filter-hint">點擊篩選 Click to filter</span>
          </div>

          <!-- Inline row: selected strip + category pills -->
          <div class="topics-inline-row">
            <!-- Selected strip -->
            <Transition name="fade-fast">
              <div v-if="selectedTopics.length > 0" class="selected-strip">
                <span class="selected-strip-label">已選 {{ selectedTopics.length }} 項：</span>
                <div class="selected-strip-chips">
                  <button
                    v-for="topic in selectedTopics"
                    :key="topic"
                    class="selected-chip"
                    @click="$emit('toggleTopic', topic)"
                    :title="`點擊取消 ${topic}`"
                  >
                    <span class="topic-hash" :style="{ color: getTopicColor(topic) }">#</span>
                    <span class="font-mono text-xs">{{ topic }}</span>
                    <svg class="w-3 h-3 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <button class="clear-all-btn" @click="clearAllTopics">全部清除</button>
                </div>
              </div>
            </Transition>

            <!-- Category pills -->
            <div class="category-pills-row">
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="cat-pill-wrap"
                :data-catid="cat.id"
                @mouseenter="activeCategoryId = cat.id"
                @mouseleave="activeCategoryId = null"
              >
                <button
                  class="cat-pill"
                  :class="{
                    'cat-pill--active': activeCategoryId === cat.id,
                    'cat-pill--has-selected': categorySelectedCount(cat.id) > 0,
                  }"
                >
                  <span class="cat-icon">
                    <svg v-if="cat.icon === 'sparkles'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
                    </svg>
                    <svg v-else-if="cat.icon === 'cloud'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    </svg>
                    <svg v-else-if="cat.icon === 'bolt'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <svg v-else-if="cat.icon === 'brain'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04ZM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
                    </svg>
                    <svg v-else-if="cat.icon === 'network'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="16" y="16" width="6" height="6" rx="1"/>
                      <rect x="2" y="16" width="6" height="6" rx="1"/>
                      <rect x="9" y="2" width="6" height="6" rx="1"/>
                      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/>
                      <path d="M12 12V8"/>
                    </svg>
                    <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
                    </svg>
                  </span>

                  <span class="cat-label">{{ cat.label }}</span>

                  <span v-if="categorySelectedCount(cat.id) > 0" class="cat-selected-badge">
                    {{ categorySelectedCount(cat.id) }}
                  </span>
                  <span v-else class="cat-count">{{ getCategoryTopicsCount(cat.id) }}</span>

                  <!-- Arrow: default ↑, rotates ↓ on hover/active -->
                  <span class="cat-arrow" :class="{ 'cat-arrow--open': activeCategoryId === cat.id }">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3 h-3">
                      <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </button>

                <!-- Floating dropdown panel -->
                <Transition name="cat-dropdown">
                  <div
                    v-if="activeCategoryId === cat.id"
                    class="cat-dropdown-panel"
                    :style="getDropdownStyle(cat.id)"
                  >
                    <div class="cat-panel-header">
                      <span class="cat-panel-title">{{ cat.label }}</span>
                      <button
                        v-if="categorySelectedCount(cat.id) > 0"
                        class="cat-panel-clear"
                        @click.stop="clearCategoryTopics(cat.id)"
                      >
                        清除 {{ categorySelectedCount(cat.id) }}
                      </button>
                    </div>
                    <div class="cat-panel-pills">
                      <button
                        v-for="topic in getCategoryTopics(cat.id)"
                        :key="topic.name"
                        class="topic-pill"
                        :class="{ 'topic-pill--active': isTopicSelected(topic.name) }"
                        :style="{ '--pill-accent': getTopicColor(topic.name) }"
                        @click="$emit('toggleTopic', topic.name)"
                      >
                        <span class="topic-hash" :style="{ color: getTopicColor(topic.name) }">#</span>
                        <span class="pill-title">{{ topic.name }}</span>
                        <span class="pill-count">{{ topic.count }}</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GitHubRepo } from '~/types/github'

interface LanguageInfo {
  name: string
  count: number
}

interface TopicInfo {
  name: string
  count: number
  repos?: string[]
}

const props = defineProps<{
  modelValue: string
  suggestions: GitHubRepo[]
  languages: LanguageInfo[]
  selectedLanguages: string[]
  topics: TopicInfo[]
  selectedTopics: string[]
  totalCount: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'toggleLanguage': [lang: string]
  'toggleTopic': [topic: string]
  'selectRepo': [repo: GitHubRepo]
}>()

const isFocused = ref(false)
const highlightedIndex = ref(-1)
const searchWrapperRef = ref<HTMLElement | null>(null)

const localQuery = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    emit('update:modelValue', v)
    highlightedIndex.value = -1
  },
})

const isLangSelected = (lang: string) => props.selectedLanguages.includes(lang)
const isTopicSelected = (topic: string) => props.selectedTopics.includes(topic)

const allLanguages = computed(() => props.languages ?? [])
const allTopics = computed(() => props.topics ?? [])

const { getLanguageColor } = useLanguageColors()
const { getTopicColor } = useTopicColors()
const { categories, getTopicCategoryId } = useTopicTaxonomy()

const activeCategoryId = ref<string | null>(null)

/**
 * Smart dropdown anchor:
 * - If the pill's center is in the LEFT half of the viewport  → anchor left:0
 * - If the pill's center is in the RIGHT half of the viewport → anchor right:0
 * This prevents the dropdown from going off-screen on either side.
 */
const getDropdownStyle = (catId: string): Record<string, string> => {
  if (!import.meta.client) return { left: '0' }
  const wrapEl = document.querySelector(`[data-catid="${catId}"]`) as HTMLElement | null
  if (!wrapEl) return { left: '0' }
  const rect = wrapEl.getBoundingClientRect()
  const pillCenter = rect.left + rect.width / 2
  const vpCenter = window.innerWidth / 2
  if (pillCenter <= vpCenter) {
    // Pill is in left half → open rightward from pill's left edge
    return { left: '0', right: 'auto' }
  } else {
    // Pill is in right half → open leftward from pill's right edge
    return { right: '0', left: 'auto' }
  }
}


const getCategoryTopics = (catId: string): TopicInfo[] => {
  if (catId === 'all') return allTopics.value
  return allTopics.value.filter(topic => getTopicCategoryId(topic.name) === catId)
}

const getCategoryTopicsCount = (catId: string): number => {
  if (catId === 'all') return allTopics.value.length
  return allTopics.value.filter(t => getTopicCategoryId(t.name) === catId).length
}

const categorySelectedCount = (catId: string): number => {
  if (catId === 'all') return props.selectedTopics.length
  return props.selectedTopics.filter(t => getTopicCategoryId(t) === catId).length
}

const clearCategoryTopics = (catId: string) => {
  const toRemove = props.selectedTopics.filter(
    t => catId === 'all' || getTopicCategoryId(t) === catId,
  )
  toRemove.forEach(t => emit('toggleTopic', t))
}

const clearAllTopics = () => {
  // Snapshot first to avoid mutating the array while iterating
  const snapshot = [...props.selectedTopics]
  snapshot.forEach(t => emit('toggleTopic', t))
}

// No outside click handler needed — hover is used instead

const highlightNext = () => {
  if (highlightedIndex.value < props.suggestions.length - 1) highlightedIndex.value++
}
const highlightPrev = () => {
  if (highlightedIndex.value > 0) highlightedIndex.value--
}
const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && props.suggestions[highlightedIndex.value]) {
    selectSuggestion(props.suggestions[highlightedIndex.value])
  }
}
const selectSuggestion = (repo: GitHubRepo) => {
  emit('update:modelValue', repo.name)
  isFocused.value = false
}
const clearSearch = () => {
  emit('update:modelValue', '')
  highlightedIndex.value = -1
}
const onBlur = () => {
  setTimeout(() => { isFocused.value = false }, 150)
}
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  background: hsla(0, 0%, 8%, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 0%, 100%, 0.15);
  border-radius: 1rem;
  transition: border-color 250ms ease, box-shadow 250ms ease;
}
.search-box--focused {
  border-color: hsla(0, 0%, 100%, 0.4);
  box-shadow: 0 0 0 3px hsla(0, 0%, 100%, 0.05), 0 0 20px hsla(0, 0%, 100%, 0.05);
}
.search-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: hsla(0, 0%, 100%, 0.6);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
}
.search-input::placeholder { color: var(--text-muted); }

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: var(--text-muted);
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 0.25rem;
  transition: color 150ms ease, background 150ms ease;
}
.clear-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: hsla(0, 0%, 7%, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-default);
  border-radius: 0.875rem;
  overflow: hidden;
  z-index: 50;
  box-shadow: 0 8px 32px hsla(0, 0%, 0%, 0.5);
}
.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
  text-align: left;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: background 150ms ease;
}
.suggestion-item:hover,
.suggestion-item--highlighted { background: var(--bg-hover); }

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 1000px;
}

.filter-group-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  user-select: none;
}

.label-icon {
  color: #ffffff;
  filter: drop-shadow(0 0 6px hsla(0, 0%, 100%, 0.45));
  flex-shrink: 0;
}

.label-title {
  font-family: var(--font-mono);
  font-size: 0.725rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: linear-gradient(180deg, #ffffff 15%, hsla(0, 0%, 100%, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px hsla(0, 0%, 100%, 0.35));
}

.filter-hint {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: none;
  color: hsla(0, 0%, 100%, 0.4);
  margin-left: 0.25rem;
}

.topics-inline-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
}

.pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
}

.filter-sep {
  width: min(100%, 640px);
  height: 1px;
  margin: 0.125rem 0;
  background: linear-gradient(90deg, transparent 0%, hsla(0,0%,100%,0.08) 25%, hsla(0,0%,100%,0.08) 75%, transparent 100%);
}

/* Language pills */
.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  background: hsla(0, 0%, 0%, 0.5);
  cursor: pointer;
  white-space: nowrap;
  transition: all 200ms ease;
}
.lang-pill:hover { border-color: var(--border-strong); color: var(--text-primary); background: hsla(0,0%,100%,0.07); transform: translateY(-1px); }
.lang-pill--active { border-color: hsla(0,0%,100%,0.5); background: hsla(0,0%,100%,0.1); color: #fff; font-weight: 600; box-shadow: 0 0 12px hsla(0,0%,100%,0.08); }
.lang-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; flex-shrink: 0; }

/* Category pills */
.category-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-start;
}
.cat-pill-wrap { position: relative; }

.cat-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.9rem 0.42rem 0.7rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  /* White gradient border via background-clip */
  border: 1px solid transparent;
  border-radius: 9999px;
  background:
    linear-gradient(hsla(0,0%,8%,0.75), hsla(0,0%,8%,0.75)) padding-box,
    linear-gradient(135deg, hsla(0,0%,100%,0.28) 0%, hsla(0,0%,100%,0.06) 50%, hsla(0,0%,100%,0.18) 100%) border-box;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  white-space: nowrap;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}
.cat-pill:hover {
  color: #fff;
  background:
    linear-gradient(hsla(0,0%,14%,0.9), hsla(0,0%,14%,0.9)) padding-box,
    linear-gradient(135deg, hsla(0,0%,100%,0.55) 0%, hsla(0,0%,100%,0.15) 50%, hsla(0,0%,100%,0.4) 100%) border-box;
}
.cat-pill--active {
  color: #fff;
  background:
    linear-gradient(hsla(0,0%,16%,0.95), hsla(0,0%,16%,0.95)) padding-box,
    linear-gradient(135deg, hsla(0,0%,100%,0.7) 0%, hsla(0,0%,100%,0.2) 50%, hsla(0,0%,100%,0.55) 100%) border-box;
  box-shadow: 0 2px 12px hsla(0,0%,0%,0.4), 0 0 16px hsla(0,0%,100%,0.06);
}
.cat-pill--has-selected {
  color: #6ee7b7;
  background:
    linear-gradient(hsla(160,60%,6%,0.85), hsla(160,60%,6%,0.85)) padding-box,
    linear-gradient(135deg, #34d399 0%, hsla(160,60%,50%,0.2) 50%, #34d399 100%) border-box;
}
.cat-pill--has-selected.cat-pill--active {
  background:
    linear-gradient(hsla(160,60%,8%,0.95), hsla(160,60%,8%,0.95)) padding-box,
    linear-gradient(135deg, #34d399 0%, hsla(160,60%,50%,0.35) 50%, #34d399 100%) border-box;
}

.cat-icon { display: flex; align-items: center; color: hsla(0,0%,100%,0.5); transition: color 200ms ease; }
.cat-pill:hover .cat-icon, .cat-pill--active .cat-icon { color: hsla(0,0%,100%,0.85); }
.cat-pill--has-selected .cat-icon { color: #34d399; }

.cat-label { letter-spacing: 0.005em; }

.cat-count {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  padding: 0.05rem 0.25rem;
  border-radius: 9999px;
  background: hsla(0,0%,100%,0.05);
  transition: all 200ms ease;
}
.cat-pill:hover .cat-count, .cat-pill--active .cat-count { background: hsla(0,0%,100%,0.1); color: hsla(0,0%,100%,0.7); }

.cat-selected-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  color: #000;
  background: #34d399;
  padding: 0.05rem 0.3rem;
  border-radius: 9999px;
  box-shadow: 0 0 8px rgba(52,211,153,0.5);
}

/* Cat arrow: default ↑, rotates ↓ on hover/active */
.cat-arrow {
  display: flex;
  align-items: center;
  color: hsla(0,0%,100%,0.4);
  margin-left: 0.1rem;
  transition: transform 220ms cubic-bezier(0.16,1,0.3,1), color 200ms ease;
  transform: rotate(0deg);
}
.cat-pill:hover .cat-arrow { color: hsla(0,0%,100%,0.75); }
.cat-arrow--open { transform: rotate(180deg); color: #fff; }

/* Floating dropdown — JS controls left/right anchor dynamically */
.cat-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  z-index: 80;
  width: max-content;
  min-width: 220px;
  max-width: min(460px, 90vw);
  padding: 0.75rem;
  background: hsla(0, 0%, 7%, 0.97);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid transparent;
  background:
    linear-gradient(hsla(0,0%,7%,0.97), hsla(0,0%,7%,0.97)) padding-box,
    linear-gradient(135deg, hsla(0,0%,100%,0.3) 0%, hsla(0,0%,100%,0.06) 50%, hsla(0,0%,100%,0.2) 100%) border-box;
  border-radius: 1rem;
  box-shadow: 0 16px 48px hsla(0,0%,0%,0.65), 0 0 0 1px hsla(0,0%,100%,0.04);
}
/* No dropdown caret arrow */
.cat-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid hsla(0,0%,100%,0.07);
}
.cat-panel-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: hsla(0,0%,100%,0.55);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.cat-panel-clear {
  font-size: 0.65rem;
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  transition: background 150ms ease;
}
.cat-panel-clear:hover { background: hsla(0,100%,70%,0.1); }

.cat-panel-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

/* Topic pills */
.topic-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1;
  color: var(--text-secondary);
  background: hsla(0,0%,10%,0.8);
  border: 1px solid hsla(0,0%,100%,0.1);
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 180ms cubic-bezier(0.16,1,0.3,1);
}
.topic-pill:hover {
  color: #fff;
  border-color: hsla(0,0%,100%,0.3);
  background: hsla(0,0%,16%,0.95);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsla(0,0%,0%,0.4), 0 0 10px color-mix(in srgb, var(--pill-accent) 25%, transparent);
}
.topic-pill--active {
  background: hsla(0,0%,14%,0.95);
  border-color: var(--pill-accent);
  color: #fff;
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow: 0 0 12px color-mix(in srgb, var(--pill-accent) 35%, transparent);
}
.topic-hash { font-weight: 700; font-size: 0.8rem; opacity: 0.9; }
.pill-title { letter-spacing: -0.01em; }
.pill-count { font-size: 0.65rem; color: var(--text-muted); opacity: 0.75; margin-left: 0.05rem; }
.topic-pill:hover .pill-count, .topic-pill--active .pill-count { color: hsla(0,0%,100%,0.85); opacity: 1; }

/* Selected strip */
.selected-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background: hsla(160,30%,8%,0.5);
  border: 1px solid hsla(160,40%,30%,0.25);
  max-width: 860px;
}
.selected-strip-label { font-size: 0.6875rem; color: #34d399; font-weight: 500; white-space: nowrap; }
.selected-strip-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem; }
.selected-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: hsla(0,0%,14%,0.85);
  border: 1px solid hsla(0,0%,100%,0.12);
  color: var(--text-primary);
  font-size: 0.725rem;
  cursor: pointer;
  transition: all 150ms ease;
}
.selected-chip:hover { border-color: #f87171; background: hsla(0,0%,18%,0.95); }
.clear-all-btn { font-size: 0.65rem; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: 0.15rem 0.35rem; text-decoration: underline; text-underline-offset: 2px; transition: color 150ms ease; }
.clear-all-btn:hover { color: #fff; }

/* Transitions */
.dropdown-enter-active { transition: opacity 200ms ease, transform 200ms cubic-bezier(0.16,1,0.3,1); }
.dropdown-leave-active { transition: opacity 150ms ease, transform 150ms ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }

/* cat-dropdown: JS controls transform — transition only uses opacity */
.cat-dropdown-enter-active { transition: opacity 200ms ease; }
.cat-dropdown-leave-active { transition: opacity 150ms ease; }
.cat-dropdown-enter-from, .cat-dropdown-leave-to { opacity: 0; }

.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 200ms ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }
</style>
