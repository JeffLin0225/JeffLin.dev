<template>
  <section id="github-search-hero" class="relative pt-14 pb-10 md:pt-20 md:pb-14">
    <!-- Background radial fade -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 40% at 50% 30%, hsla(0,0%,100%,0.02), transparent 70%)" />
    </div>

    <div class="container-main relative z-10">
      <!-- Title -->
      <div class="text-center mb-10 animate-fade-up">
        <h1 class="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
          <span class="text-text-muted font-mono text-lg mr-2"></span>GitHub 專案搜尋器
        </h1>
        <p class="text-text-secondary text-sm md:text-base">
          搜尋與瀏覽我的開源 Repositories
          <span
            v-if="totalCount > 0"
            class="inline-flex items-center ml-2 px-2 py-0.5 text-xs font-mono bg-surface-elevated border border-border-subtle rounded-pill text-text-secondary"
          >
            {{ totalCount }} repos
          </span>
        </p>
      </div>

      <!-- Filter Section -->
      <div class="filter-section animate-fade-up stagger-2 mb-5">
        <!-- Language Filter -->
        <div class="filter-group" v-if="allLanguages.length > 0">
          <span class="filter-label">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20"/></svg>
            Language
            <span class="filter-hint">點擊篩選 Click to filter</span>
          </span>
          <div class="filter-pills">
            <button
              v-for="lang in allLanguages"
              :key="lang.name"
              class="lang-pill"
              :class="{ 'lang-pill--active': isLangSelected(lang.name) }"
              @click="$emit('toggleLanguage', lang.name)"
            >
              <span class="lang-dot" :style="{ background: getLanguageColor(lang.name) }" />
              {{ lang.name }}
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="filter-divider" v-if="allLanguages.length > 0 && allTopics.length > 0" />

        <!-- Topics Filter -->
        <div class="filter-group" v-if="allTopics.length > 0">
          <span class="filter-label">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Topics
            <span class="filter-hint">點擊篩選 Click to filter</span>
          </span>
          <div class="filter-pills">
            <button
              v-for="topic in allTopics"
              :key="topic.name"
              class="topic-pill"
              :class="{ 'topic-pill--active': isTopicSelected(topic.name) }"
              @click="$emit('toggleTopic', topic.name)"
            >
              <span class="topic-hash" :style="{ color: getTopicColor(topic.name) }">#</span>{{ topic.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Search input -->
      <div class="flex justify-center animate-fade-up stagger-3">
        <div class="relative w-full max-w-lg" ref="searchWrapperRef">
          <div
            class="search-box"
            :class="{ 'search-box--focused': isFocused }"
          >
            <!-- Search icon -->
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
            <!-- Clear button -->
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

          <!-- Suggestions dropdown (Google-style) -->
          <Transition name="dropdown">
            <div
              v-if="isFocused && suggestions.length > 0"
              class="suggestions-dropdown"
            >
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
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GitHubRepo } from '~/server/utils/github'

interface LanguageInfo {
  name: string
  count: number
}

interface TopicInfo {
  name: string
  count: number
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

/* ─── 分配語言到左右兩側 ─── */
const allLanguages = computed(() => props.languages)
const allTopics = computed(() => props.topics)

/* ─── 顏色 ─── */
const { getLanguageColor } = useLanguageColors()
const { getTopicColor } = useTopicColors()

/* ─── 鍵盤導航 ─── */
const highlightNext = () => {
  if (highlightedIndex.value < props.suggestions.length - 1) {
    highlightedIndex.value++
  }
}
const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
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
/* ─── Search Box ─── */
.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: hsla(0, 0%, 8%, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  border-radius: 0.75rem;
  transition: border-color 250ms ease, box-shadow 250ms ease;
}
.search-box--focused {
  border-color: hsla(0, 0%, 100%, 0.5);
  box-shadow: 0 0 0 3px hsla(0, 0%, 100%, 0.06), 0 0 20px hsla(0, 0%, 100%, 0.05);
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
.search-input::placeholder {
  color: var(--text-muted);
}

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
.clear-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* ─── Suggestions Dropdown ─── */
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: hsla(0, 0%, 7%, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
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
.suggestion-item--highlighted {
  background: var(--bg-hover);
}

/* ─── Filter Section Layout ─── */
.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: hsla(0, 0%, 100%, 0.75);
  white-space: nowrap;
}

.filter-hint {
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: none;
  color: hsla(0, 0%, 100%, 0.3);
  margin-left: 0.25rem;
}

/* ─── Gradient Divider ─── */
.filter-divider {
  width: 240px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsla(0, 0%, 100%, 0.15) 30%,
    hsla(0, 0%, 100%, 0.15) 70%,
    transparent 100%
  );
  border: none;
}

/* ─── Language Pills ─── */
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
}

.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4375rem 0.875rem;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  background: hsla(0, 0%, 0%, 0.6);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 250ms ease, background 250ms ease, color 250ms ease, transform 250ms cubic-bezier(0.68, -0.15, 0.27, 1.15), box-shadow 250ms ease;
}
.lang-pill:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
  background: hsla(0, 0%, 0%, 0.8);
}
.lang-pill--active {
  border-color: hsla(0, 0%, 100%, 0.4);
  background: hsla(0, 0%, 0%, 0.85);
  color: var(--text-primary);
  font-weight: 600;
  transform: scale(1.05);
  box-shadow: 0 0 10px hsla(0, 0%, 100%, 0.06), inset 0 0 8px hsla(0, 0%, 100%, 0.03);
}
.lang-pill--active .lang-dot {
  width: 0.625rem;
  height: 0.625rem;
  box-shadow: 0 0 6px currentColor;
}

.lang-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  transition: width 200ms ease, height 200ms ease, box-shadow 200ms ease;
}

/* ─── Topic Pills ─── */
.topic-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.4375rem 0.875rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.7875rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  background: hsla(0, 0%, 0%, 0.6);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 250ms ease, background 250ms ease, color 250ms ease, transform 250ms cubic-bezier(0.68, -0.15, 0.27, 1.15), box-shadow 250ms ease;
}
.topic-pill:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
  background: hsla(0, 0%, 0%, 0.8);
}
.topic-pill--active {
  border-color: hsla(0, 0%, 100%, 0.4);
  background: hsla(0, 0%, 0%, 0.85);
  color: var(--text-primary);
  font-weight: 600;
  transform: scale(1.05);
  box-shadow: 0 0 10px hsla(0, 0%, 100%, 0.06), inset 0 0 8px hsla(0, 0%, 100%, 0.03);
}

.topic-hash {
  font-weight: 700;
  margin-right: 0.0625rem;
  /* color 由 inline style 決定，不在這裡設定 */
}

/* ─── Dropdown Transition ─── */
.dropdown-enter-active {
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
