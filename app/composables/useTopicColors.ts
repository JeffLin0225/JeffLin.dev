/**
 * Topics 顏色對照表
 * 依照技術類別給予對應的代表色，未知 topic 依名稱 hash 分配顏色
 */

const topicColors: Record<string, string> = {
  // 框架 / Runtime
  'gin': '#00ADD8',
  'echo': '#00ADD8',
  'fiber': '#00ADD8',
  'fastapi': '#009688',
  'django': '#092E20',
  'flask': '#000000',
  'express': '#68A063',
  'nestjs': '#E0234E',
  'nextjs': '#ffffff',
  'nuxt': '#41b883',
  'nuxtjs': '#41b883',
  'vue': '#41b883',
  'vuejs': '#41b883',
  'react': '#61DAFB',
  'svelte': '#FF3E00',
  'angular': '#DD0031',
  'laravel': '#FF2D20',
  'spring': '#6DB33F',
  'rails': '#CC0000',

  // 語言相關
  'golang': '#00ADD8',
  'go': '#00ADD8',
  'python': '#3572A5',
  'typescript': '#3178c6',
  'javascript': '#f1e05a',
  'rust': '#dea584',
  'java': '#ED8B00',
  'cpp': '#f34b7d',
  'c': '#555555',
  'ruby': '#701516',
  'php': '#4F5D95',
  'swift': '#F05138',
  'kotlin': '#A97BFF',
  'dart': '#00B4AB',

  // 基礎設施 / DevOps
  'kubernetes': '#326CE5',
  'k8s': '#326CE5',
  'docker': '#2496ED',
  'terraform': '#844FBA',
  'ansible': '#EE0000',
  'helm': '#0F1689',
  'ci-cd': '#F7A81B',
  'github-actions': '#2088FF',
  'cloudflare': '#F38020',
  'aws': '#FF9900',
  'gcp': '#4285F4',
  'azure': '#0078D4',

  // 架構 / 模式
  'serverless': '#FD5750',
  'microservices': '#FF6B6B',
  'rest-api': '#25D366',
  'graphql': '#E10098',
  'grpc': '#244C5A',
  'websocket': '#8B5CF6',

  // 資料庫
  'postgresql': '#336791',
  'postgres': '#336791',
  'mysql': '#4479A1',
  'mongodb': '#47A248',
  'redis': '#DC382D',
  'sqlite': '#003B57',
  'elasticsearch': '#F04E98',

  // 工具 / 其他
  'cli': '#89e051',
  'api': '#25D366',
  'bot': '#5865F2',
  'discord': '#5865F2',
  'telegram': '#2CA5E0',
  'web': '#E34C26',
  'fullstack': '#61DAFB',
  'backend': '#68A063',
  'frontend': '#f1e05a',
  'open-source': '#24292E',
  'automation': '#F7A81B',
  'crawler': '#FF6B35',
  'scraper': '#FF6B35',
  'game': '#FF4500',
  'machine-learning': '#FF6F00',
  'ai': '#412991',
  'llm': '#412991',
}

// hash 函數：把沒有定義的 topic 分配一個固定顏色（hue based）
const hashTopicColor = (topic: string): string => {
  let hash = 0
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = ((hash % 360) + 360) % 360
  const sat = 55 + (Math.abs(hash) % 25)
  const lit = 55 + (Math.abs(hash >> 4) % 15)
  return `hsl(${hue}, ${sat}%, ${lit}%)`
}

export const useTopicColors = () => {
  /**
   * 解析某個 topic 的「父系 key」
   * cloudflare-workers → cloudflare
   * nuxt4              → nuxt
   * vue                → vue（無父系，回傳自身）
   */
  const resolveParentKey = (topic: string): string => {
    const key = topic.toLowerCase()

    // 精確定義過的，本身就是根
    if (topicColors[key]) return key

    // 前綴繼承（從最長到最短）
    const parts = key.split('-')
    for (let i = parts.length - 1; i >= 1; i--) {
      const prefix = parts.slice(0, i).join('-')
      if (topicColors[prefix]) return prefix
    }

    // 數字後綴脫落（nuxt4 → nuxt）
    const withoutDigits = key.replace(/\d+$/, '')
    if (withoutDigits !== key && topicColors[withoutDigits]) return withoutDigits

    // 找不到父系，以原始 key 作為自身根
    return key
  }

  const getTopicColor = (topic: string): string => {
    const parent = resolveParentKey(topic)
    return topicColors[parent] ?? hashTopicColor(topic)
  }

  /**
   * 將 topics 陣列收斂：同一父系只留優先代表
   * 優先順序：已精確定義的 key > 其他衍生
   * e.g. ['cloudflare-pages', 'cloudflare', 'cloudflare-workers'] → ['cloudflare']
   */
  const collapseTopics = (topics: string[]): string[] => {
    // parentKey → 最佳代表 topic 的 map
    const grouped = new Map<string, string>()

    for (const topic of topics) {
      const parent = resolveParentKey(topic)
      const existing = grouped.get(parent)

      if (!existing) {
        grouped.set(parent, topic)
      } else {
        // 優先選「精確定義過」或「較短（更根本）」的
        const existingIsExact = !!topicColors[existing.toLowerCase()]
        const currentIsExact = !!topicColors[topic.toLowerCase()]
        if (currentIsExact && !existingIsExact) {
          grouped.set(parent, topic)
        } else if (!existingIsExact && !currentIsExact && topic.length < existing.length) {
          grouped.set(parent, topic)
        }
      }
    }

    return Array.from(grouped.values())
  }

  return { getTopicColor, collapseTopics, resolveParentKey }
}

