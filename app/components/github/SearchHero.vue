<template>
  <section id="github-search-hero" class="relative pt-12 pb-10 md:pt-16 md:pb-12">
    <!-- Background subtle radial & glow -->
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
            class="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-white/[0.06] text-text-primary rounded-full"
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

      <!-- Filter Section -->
      <div class="filter-section animate-fade-up stagger-2 mb-6">
        <!-- Language Filter -->
        <div class="filter-group" v-if="allLanguages.length > 0">
          <span class="filter-label">
            <svg class="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20"/>
            </svg>
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
              <span class="font-medium">{{ lang.name }}</span>
              <span class="lang-count">{{ lang.count }}</span>
            </button>
          </div>
        </div>

        <!-- Divider -->
        <div class="filter-divider" v-if="allLanguages.length > 0 && allTopics.length > 0" />

        <!-- Topics Filter Group -->
        <div class="filter-group" v-if="allTopics.length > 0">
          <span class="filter-label">
            <svg class="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Topics
            <span class="filter-hint">點擊篩選 Click to filter</span>
          </span>

          <!-- Unified Taxonomy Card (聚合一體島：頂部領域與底部標籤緊密 UI 關聯) -->
          <div class="taxonomy-hub">
            <!-- 1. Category Dock Header (頂部領域導覽) -->
            <div class="taxonomy-hub-header">
              <div class="category-dock">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  class="category-btn"
                  :class="{ 'category-btn--active': activeCategoryId === cat.id }"
                  @mouseenter="activeCategoryId = cat.id"
                  @click="activeCategoryId = cat.id"
                >
                  <!-- Icon -->
                  <span class="category-icon-wrapper">
                    <!-- Sparkles (All) -->
                    <svg v-if="cat.icon === 'sparkles'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
                    </svg>
                    <!-- Cloud (DevOps) -->
                    <svg v-else-if="cat.icon === 'cloud'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    </svg>
                    <!-- Bolt (Frameworks) -->
                    <svg v-else-if="cat.icon === 'bolt'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <!-- Brain (Data & AI) -->
                    <svg v-else-if="cat.icon === 'brain'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04ZM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
                    </svg>
                    <!-- Network (Architecture) -->
                    <svg v-else-if="cat.icon === 'network'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="16" y="16" width="6" height="6" rx="1"/>
                      <rect x="2" y="16" width="6" height="6" rx="1"/>
                      <rect x="9" y="2" width="6" height="6" rx="1"/>
                      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/>
                      <path d="M12 12V8"/>
                    </svg>
                    <!-- Gauge (Tools) -->
                    <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m12 14 4-4"/>
                      <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
                    </svg>
                  </span>

                  <span class="category-name">{{ cat.label }}</span>

                  <!-- Category badge -->
                  <span
                    v-if="categorySelectedCount(cat.id) > 0"
                    class="category-active-pip"
                  >
                    {{ categorySelectedCount(cat.id) }}
                  </span>
                  <span v-else class="category-total-badge">
                    {{ getCategoryTopicsCount(cat.id) }}
                  </span>

                  <!-- Downward Caret (指向下方標籤艙) -->
                  <span v-if="activeCategoryId === cat.id" class="category-active-caret" />
                </button>
              </div>
            </div>

            <!-- Hub Connector Line (關聯銜接指示線) -->
            <div class="taxonomy-hub-divider" />

            <!-- 2. Linked Pills Compartment (聚合標籤艙) -->
            <div class="taxonomy-hub-body">
              <div class="topics-pills-container relative">
                <TransitionGroup name="pill-fade" tag="div" class="topics-pills-grid">
                  <div
                    v-for="topic in displayedTopics"
                    :key="topic.name"
                    class="topic-pill-wrapper group relative"
                  >
                    <button
                      class="topic-pill"
                      :class="{ 'topic-pill--active': isTopicSelected(topic.name) }"
                      :style="{
                        '--pill-accent': getTopicColor(topic.name),
                      }"
                      @click="$emit('toggleTopic', topic.name)"
                    >
                      <!-- Hash & Topic Name -->
                      <span class="topic-hash" :style="{ color: getTopicColor(topic.name) }">#</span>
                      <span class="pill-title">{{ topic.name }}</span>

                      <!-- Count Badge -->
                      <span class="pill-count">
                        {{ topic.count }}
                      </span>
                    </button>

                    <!-- Hover Micro-Preview Floating Card -->
                    <div class="hover-preview-card">
                      <div class="preview-header">
                        <span class="font-mono text-xs font-semibold text-text-primary flex items-center gap-1">
                          <span :style="{ color: getTopicColor(topic.name) }">#</span>
                          {{ topic.name }}
                        </span>
                        <span class="preview-count-chip">
                          {{ topic.count }} {{ topic.count > 1 ? 'Repos' : 'Repo' }}
                        </span>
                      </div>

                      <div v-if="topic.repos && topic.repos.length > 0" class="preview-repo-list">
                        <div class="preview-repo-label">涵蓋專案：</div>
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-for="repoName in topic.repos.slice(0, 4)"
                            :key="repoName"
                            class="preview-repo-tag font-mono text-[11px]"
                          >
                            {{ repoName }}
                          </span>
                          <span
                            v-if="topic.repos.length > 4"
                            class="text-[10px] text-text-muted self-center font-mono ml-1"
                          >
                            +{{ topic.repos.length - 4 }}
                          </span>
                        </div>
                      </div>
                      <div class="preview-hint">
                        點擊標籤切換篩選
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>

              <!-- 3. Minimalist Selected Strip (內嵌於聚合島底部) -->
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
                      <svg class="w-3 h-3 text-text-muted hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                    <button class="clear-all-btn" @click="clearAllTopics">
                      全部清除
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
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

const allLanguages = computed(() => props.languages)
const allTopics = computed(() => props.topics)

/* ─── 顏色與領域分類 ─── */
const { getLanguageColor } = useLanguageColors()
const { getTopicColor } = useTopicColors()
const { categories, getTopicCategoryId } = useTopicTaxonomy()

// 當前選中的大類（預設為 'all'）
const activeCategoryId = ref('all')

// 依大類過濾出的 topics
const displayedTopics = computed(() => {
  if (activeCategoryId.value === 'all') {
    return allTopics.value
  }
  return allTopics.value.filter(
    topic => getTopicCategoryId(topic.name) === activeCategoryId.value,
  )
})

// 計算某大類中的 topic 總數
const getCategoryTopicsCount = (catId: string): number => {
  if (catId === 'all') return allTopics.value.length
  return allTopics.value.filter(t => getTopicCategoryId(t.name) === catId).length
}

// 計算某大類中已被選取的 topic 數
const categorySelectedCount = (catId: string): number => {
  if (catId === 'all') return props.selectedTopics.length
  return props.selectedTopics.filter(
    t => getTopicCategoryId(t) === catId,
  ).length
}

// 清除所有已選 topics
const clearAllTopics = () => {
  props.selectedTopics.forEach((t) => {
    emit('toggleTopic', t)
  })
}

/* ─── Hover 微預覽卡片狀態 ─── */
const hoveredTopicName = ref<string | null>(null)

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
  background: hsla(0, 0%, 8%, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 0%, 100%, 0.15);
  border-radius: 0.75rem;
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
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: hsla(0, 0%, 100%, 0.8);
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
  width: min(100%, 420px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsla(0, 0%, 100%, 0.12) 30%,
    hsla(0, 0%, 100%, 0.12) 70%,
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
  max-width: 860px;
}

.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  font-family: var(--font-display);
  font-size: 0.7875rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  background: hsla(0, 0%, 0%, 0.5);
  cursor: pointer;
  white-space: nowrap;
  transition: all 200ms ease;
}
.lang-pill:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
  background: hsla(0, 0%, 0%, 0.75);
  transform: translateY(-1px);
}
.lang-pill--active {
  border-color: hsla(0, 0%, 100%, 0.5);
  background: hsla(0, 0%, 100%, 0.08);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 0 12px hsla(0, 0%, 100%, 0.08);
}
.lang-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  flex-shrink: 0;
}
.lang-count {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-left: 0.1rem;
}
.lang-pill--active .lang-count {
  color: hsla(0, 0%, 100%, 0.7);
}

/* ─── Unified Taxonomy Card (聚合一體島：頂部領域與底部標籤緊密 UI 關聯) ─── */
.taxonomy-hub {
  width: 100%;
  max-width: 920px;
  background: hsla(0, 0%, 5%, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  border-radius: 1.25rem;
  padding: 0.65rem 0.85rem 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 8px 32px hsla(0, 0%, 0%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.05);
  position: relative;
  transition: border-color 200ms ease;
}

.taxonomy-hub-header {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0.1rem 0;
}

.taxonomy-hub-divider {
  width: 100%;
  max-width: 860px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsla(0, 0%, 100%, 0.08) 20%,
    hsla(0, 0%, 100%, 0.08) 80%,
    transparent 100%
  );
  margin: -0.1rem 0 0.1rem 0;
}

.taxonomy-hub-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}

/* ─── 1. Category Capsule Dock ─── */
.category-dock {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.22rem 0.25rem;
  background: hsla(0, 0%, 8%, 0.8);
  border: 1px solid hsla(0, 0%, 100%, 0.07);
  border-radius: 9999px;
  box-shadow: inset 0 1px 2px hsla(0, 0%, 0%, 0.35);
  position: relative;
}

.category-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid transparent;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.category-btn:hover {
  color: var(--text-primary);
  background: hsla(0, 0%, 100%, 0.06);
}
.category-btn--active {
  background: hsla(0, 0%, 100%, 0.12);
  border-color: hsla(0, 0%, 100%, 0.2);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.35), inset 0 1px 0 hsla(0, 0%, 100%, 0.15);
}

/* Downward indicator notch on active category tab pointing into pills compartment */
.category-active-caret {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid hsla(0, 0%, 100%, 0.45);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
  pointer-events: none;
  z-index: 10;
}

.category-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsla(0, 0%, 100%, 0.6);
}
.category-btn--active .category-icon-wrapper {
  color: #ffffff;
}

.category-name {
  letter-spacing: 0.01em;
}

.category-total-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  padding: 0.05rem 0.25rem;
  border-radius: 9999px;
  background: hsla(0, 0%, 100%, 0.04);
}
.category-btn--active .category-total-badge {
  color: hsla(0, 0%, 100%, 0.85);
  background: hsla(0, 0%, 100%, 0.1);
}

.category-active-pip {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #000000;
  background: #34d399;
  padding: 0.05rem 0.35rem;
  border-radius: 9999px;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.5);
}

/* ─── 2. Minimalist Selected Strip ─── */
.selected-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.65rem;
  border-radius: 9999px;
  background: hsla(160, 30%, 8%, 0.5);
  border: 1px solid hsla(160, 40%, 30%, 0.25);
  max-width: 860px;
}
.selected-strip-label {
  font-size: 0.6875rem;
  color: #34d399;
  font-weight: 500;
  white-space: nowrap;
}
.selected-strip-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}
.selected-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: hsla(0, 0%, 14%, 0.85);
  border: 1px solid hsla(0, 0%, 100%, 0.12);
  color: var(--text-primary);
  font-size: 0.725rem;
  cursor: pointer;
  transition: all 150ms ease;
}
.selected-chip:hover {
  border-color: #f87171;
  background: hsla(0, 0%, 18%, 0.95);
}
.clear-all-btn {
  font-size: 0.65rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.15rem 0.35rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 150ms ease;
}
.clear-all-btn:hover {
  color: #ffffff;
}

/* ─── 3. Compact Topic Pills Grid ─── */
.topics-pills-container {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 44px;
}

.topics-pills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
  max-width: 880px;
  padding: 0.1rem 0;
}

.topic-pill-wrapper {
  display: inline-flex;
}

.topic-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.32rem 0.7rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1;
  color: var(--text-secondary);
  background: hsla(0, 0%, 7%, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.topic-pill:hover {
  color: #ffffff;
  border-color: hsla(0, 0%, 100%, 0.3);
  background: hsla(0, 0%, 12%, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.4), 0 0 10px color-mix(in srgb, var(--pill-accent) 25%, transparent);
}

.topic-pill--active {
  background: hsla(0, 0%, 12%, 0.95);
  border-color: var(--pill-accent);
  color: #ffffff;
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow: 0 0 12px color-mix(in srgb, var(--pill-accent) 35%, transparent);
}

.topic-hash {
  font-weight: 700;
  font-size: 0.8rem;
  opacity: 0.9;
}

.pill-title {
  position: relative;
  letter-spacing: -0.01em;
}

.pill-count {
  font-size: 0.65rem;
  color: var(--text-muted);
  opacity: 0.75;
  margin-left: 0.05rem;
}
.topic-pill:hover .pill-count,
.topic-pill--active .pill-count {
  color: hsla(0, 0%, 100%, 0.85);
  opacity: 1;
}

/* Stagger transition for pills */
.pill-fade-move,
.pill-fade-enter-active,
.pill-fade-leave-active {
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.pill-fade-enter-from,
.pill-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(3px);
}
.pill-fade-leave-active {
  position: absolute;
}

/* ─── 4. Hover Micro-Preview Floating Card ─── */
.hover-preview-card {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px) scale(0.96);
  z-index: 70;
  pointer-events: none;
  width: max-content;
  min-width: 180px;
  max-width: 250px;
  padding: 0.65rem 0.75rem;
  background: hsla(0, 0%, 9%, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid hsla(0, 0%, 100%, 0.18);
  border-radius: 0.75rem;
  box-shadow: 0 12px 36px hsla(0, 0%, 0%, 0.7), 0 0 0 1px hsla(0, 0%, 100%, 0.06);
  opacity: 0;
  visibility: hidden;
  transition: opacity 160ms ease, transform 160ms cubic-bezier(0.16, 1, 0.3, 1), visibility 160ms;
}

.topic-pill-wrapper:hover .hover-preview-card,
.topic-pill-wrapper:focus-within .hover-preview-card {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}

.hover-preview-card::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: hsla(0, 0%, 18%, 0.95) transparent transparent transparent;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.08);
}

.preview-count-chip {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.preview-repo-list {
  margin-bottom: 0.35rem;
}

.preview-repo-label {
  font-size: 0.625rem;
  color: var(--text-muted);
  margin-bottom: 0.2rem;
}

.preview-repo-tag {
  background: hsla(0, 0%, 100%, 0.07);
  border: 1px solid hsla(0, 0%, 100%, 0.09);
  color: var(--text-secondary);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-hint {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: 0.2rem;
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
