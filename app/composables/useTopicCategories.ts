/**
 * Topics 分類系統
 * 將所有 topics 歸類到 6 大類，方便使用者快速找到想要的 topic
 */

export interface TopicCategory {
  id: string
  label: string
  /** SVG path(s) for the icon */
  iconPaths: string[]
  iconViewBox?: string
  topics: string[] // 屬於此分類的 topic 關鍵字（模糊匹配）
}

/** 6 大分類定義 */
export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'framework',
    label: 'Framework',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M12 2L2 7l10 5 10-5-10-5z',
      'M2 17l10 5 10-5',
      'M2 12l10 5 10-5',
    ],
    topics: [
      'vue', 'vuejs', 'react', 'nuxt', 'nuxtjs', 'nextjs', 'svelte', 'angular',
      'fastapi', 'django', 'flask', 'express', 'nestjs', 'gin', 'echo', 'fiber',
      'laravel', 'spring', 'rails',
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
    ],
    topics: [
      'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'helm',
      'github-actions', 'ci-cd', 'cloudflare', 'aws', 'gcp', 'azure', 'serverless',
    ],
  },
  {
    id: 'database',
    label: 'Database',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4z',
      'M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4',
      'M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4',
    ],
    topics: [
      'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'elasticsearch',
    ],
  },
  {
    id: 'ai',
    label: 'AI & ML',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z',
      'M9 14h.01M15 14h.01M9 17h6',
    ],
    topics: [
      'ai', 'llm', 'machine-learning', 'ml', 'deep-learning', 'neural',
      'gpt', 'openai', 'langchain', 'rag',
    ],
  },
  {
    id: 'language',
    label: 'Language',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    ],
    topics: [
      'golang', 'go', 'python', 'typescript', 'javascript', 'rust',
      'java', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'cpp', 'c',
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    iconViewBox: '0 0 24 24',
    iconPaths: [
      'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
    ],
    topics: [
      'cli', 'bot', 'discord', 'telegram', 'automation', 'crawler', 'scraper',
      'api', 'rest-api', 'graphql', 'grpc', 'websocket', 'web', 'fullstack',
      'backend', 'frontend', 'open-source', 'game', 'microservices',
    ],
  },
]

/** topic name → category id 的快速查找 map */
const topicToCategoryMap = new Map<string, string>()
for (const cat of TOPIC_CATEGORIES) {
  for (const t of cat.topics) {
    topicToCategoryMap.set(t.toLowerCase(), cat.id)
  }
}

export const useTopicCategories = () => {
  /**
   * 解析一個 topic name 屬於哪個 category id
   * 用前綴繼承邏輯（e.g. cloudflare-workers → cloudflare → devops）
   */
  const getCategoryId = (topicName: string): string | null => {
    const key = topicName.toLowerCase()

    // 精確命中
    if (topicToCategoryMap.has(key)) return topicToCategoryMap.get(key)!

    // 前綴繼承（由長到短）
    const parts = key.split('-')
    for (let i = parts.length - 1; i >= 1; i--) {
      const prefix = parts.slice(0, i).join('-')
      if (topicToCategoryMap.has(prefix)) return topicToCategoryMap.get(prefix)!
    }

    // 數字後綴脫落（nuxt4 → nuxt）
    const withoutDigits = key.replace(/\d+$/, '')
    if (withoutDigits !== key && topicToCategoryMap.has(withoutDigits)) {
      return topicToCategoryMap.get(withoutDigits)!
    }

    return null
  }

  /**
   * 將 availableTopics 分組成各類別下的 topics 陣列
   * 回傳每個 category（只包含實際有 topics 的），以及未分類的 others
   */
  const groupTopicsByCategory = (topics: { name: string; count: number }[]) => {
    const catMap = new Map<string, { name: string; count: number }[]>()

    // 初始化每個分類
    for (const cat of TOPIC_CATEGORIES) {
      catMap.set(cat.id, [])
    }

    const others: { name: string; count: number }[] = []

    for (const topic of topics) {
      const catId = getCategoryId(topic.name)
      if (catId && catMap.has(catId)) {
        catMap.get(catId)!.push(topic)
      } else {
        others.push(topic)
      }
    }

    // 只回傳有 topics 的分類
    const grouped = TOPIC_CATEGORIES
      .filter(cat => (catMap.get(cat.id)?.length ?? 0) > 0)
      .map(cat => ({
        ...cat,
        availableTopics: catMap.get(cat.id)!,
      }))

    return { grouped, others }
  }

  return { getCategoryId, groupTopicsByCategory }
}
