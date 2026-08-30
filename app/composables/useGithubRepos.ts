import Fuse, { type IFuseOptions } from 'fuse.js'
import type { GitHubRepo } from '~/types/github'

/**
 * GitHub Repos 資料管理 Composable
 * - SSR 取資料 → 客戶端建立 Fuse.js 索引
 * - 搜尋、語言篩選、Topics 篩選、Google 式搜尋建議
 */
export const useGithubRepos = () => {
  const repos = useState<GitHubRepo[]>('github-repos', () => [])
  const searchQuery = useState<string>('github-search', () => '')
  const selectedLanguages = useState<string[]>('github-langs', () => [])
  const selectedTopics = useState<string[]>('github-topics', () => [])
  const isLoading = useState<boolean>('github-loading', () => false)
  const lastSync = useState<string>('github-last-sync', () => '')

  /* ─── Fuse.js 設定 ─── */
  const fuseOptions: IFuseOptions<GitHubRepo> = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'language', weight: 0.15 },
      { name: 'topics', weight: 0.15 },
    ],
    threshold: 0.3,
    distance: 200,
    minMatchCharLength: 2,
    includeScore: true,
    shouldSort: true,
  }

  const fuse = computed(() => new Fuse(repos.value, fuseOptions))

  /* ─── 可用語言列表（從 repos 動態生成）─── */
  const availableLanguages = computed(() => {
    const langMap = new Map<string, number>()
    for (const repo of repos.value) {
      if (repo.language) {
        langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1)
      }
    }
    return Array.from(langMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ name: lang, count }))
  })

  /* ─── 可用 Topics 列表（從 repos 動態生成，依出現次數排序）─── */
  const availableTopics = computed(() => {
    const topicMap = new Map<string, number>()
    for (const repo of repos.value) {
      for (const topic of repo.topics ?? []) {
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1)
      }
    }
    return Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  })

  /* ─── 搜尋建議（Google 式 dropdown，最多 6 筆）─── */
  const suggestions = computed(() => {
    const q = searchQuery.value.trim()
    if (q.length < 2) return []
    return fuse.value
      .search(q)
      .slice(0, 6)
      .map(r => r.item)
  })

  /* ─── 篩選結果（搜尋 + 語言 + Topics 三重篩選）─── */
  const filteredRepos = computed(() => {
    let result: GitHubRepo[]
    const q = searchQuery.value.trim()

    // 搜尋篩選
    if (q.length >= 2) {
      result = fuse.value.search(q).map(r => r.item)
    } else {
      result = [...repos.value]
    }

    // 語言篩選（OR）
    if (selectedLanguages.value.length > 0) {
      result = result.filter(repo =>
        repo.language && selectedLanguages.value.includes(repo.language),
      )
    }

    // Topics 篩選（OR：包含任一選中 topic 即顯示）
    if (selectedTopics.value.length > 0) {
      result = result.filter(repo =>
        repo.topics?.some(t => selectedTopics.value.includes(t)),
      )
    }

    return result
  })

  /* ─── 取得資料（lazy: 頁面先切換，資料背景載入）─── */
  const fetchRepos = async () => {
    const config = useRuntimeConfig()

    const { data, error, pending } = await useAsyncData('github-repos', () =>
      $fetch<{ success: boolean; data: GitHubRepo[]; lastSync: string }>('/api/github', {
        headers: {
          'x-internal-token': config.public.internalApiToken,
        },
      }),
      { lazy: true },
    )

    // 將 useAsyncData 的 pending 狀態同步到 isLoading
    watch(pending, (val) => { isLoading.value = val }, { immediate: true })

    // 資料到達時更新
    watch(data, (val) => {
      if (val && val.success) {
        repos.value = val.data
        lastSync.value = val.lastSync
      }
    }, { immediate: true })

    if (error.value) {
      console.error('[useGithubRepos] Fetch error:', error.value)
    }
  }

  /* ─── 語言篩選切換 ─── */
  const toggleLanguage = (lang: string) => {
    const idx = selectedLanguages.value.indexOf(lang)
    if (idx >= 0) {
      selectedLanguages.value.splice(idx, 1)
    } else {
      selectedLanguages.value.push(lang)
    }
  }

  /* ─── Topics 篩選切換 ─── */
  const toggleTopic = (topic: string) => {
    const idx = selectedTopics.value.indexOf(topic)
    if (idx >= 0) {
      selectedTopics.value.splice(idx, 1)
    } else {
      selectedTopics.value.push(topic)
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedLanguages.value = []
    selectedTopics.value = []
  }

  return {
    repos,
    searchQuery,
    selectedLanguages,
    selectedTopics,
    isLoading,
    lastSync,
    suggestions,
    filteredRepos,
    availableLanguages,
    availableTopics,
    fetchRepos,
    toggleLanguage,
    toggleTopic,
    clearFilters,
  }
}

