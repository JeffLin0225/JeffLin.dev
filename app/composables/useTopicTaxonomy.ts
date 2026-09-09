/**
 * Topic 領域分類定義 (Taxonomy System)
 * 將多樣且繁雜的技術標籤自動聚類為高辨識度的五大核心領域與「全部」集合
 */

export interface TopicCategory {
  id: string
  label: string
  labelZh: string
  icon: string
  description: string
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'all',
    label: 'All',
    labelZh: '全部',
    icon: 'sparkles',
    description: '檢視所有技術項目標籤',
  },
  {
    id: 'devops',
    label: 'Cloud & DevOps',
    labelZh: '雲端維運',
    icon: 'cloud',
    description: '容器編排、CI/CD、基礎設施即代碼與雲端原生技術',
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    labelZh: '現代框架',
    icon: 'bolt',
    description: '前端、全端與後端應用程式框架',
  },
  {
    id: 'data-ai',
    label: 'Data & AI',
    labelZh: '資料智慧',
    icon: 'brain',
    description: '分散式資料庫、快取、串流引擎與機器學習模型',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    labelZh: '架構協定',
    icon: 'network',
    description: '微服務通訊、長連接協定、非同步佇列與無伺服器',
  },
  {
    id: 'tools',
    label: 'Tools',
    labelZh: '生態工具',
    icon: 'gauge',
    description: '指標監控、自動擴展、通訊機器人與生態工具',
  },
]

// 顯式分類對照表（小寫）
const topicCategoryMap: Record<string, string> = {
  // Cloud & DevOps
  'kubernetes': 'devops',
  'k8s': 'devops',
  'minikube': 'devops',
  'docker': 'devops',
  'terraform': 'devops',
  'ansible': 'devops',
  'argocd': 'devops',
  'gitops': 'devops',
  'cicd': 'devops',
  'jenkins': 'devops',
  'helm': 'devops',
  'github-actions': 'devops',
  'cloudflare': 'devops',
  'cloudflare-pages': 'devops',
  'cloudflare-workers': 'devops',
  'gcp': 'devops',
  'aws': 'devops',
  'azure': 'devops',

  // Frameworks & Fullstack
  'vue': 'frameworks',
  'vue3': 'frameworks',
  'vuejs': 'frameworks',
  'nuxt': 'frameworks',
  'nuxt4': 'frameworks',
  'nuxtjs': 'frameworks',
  'react': 'frameworks',
  'vite': 'frameworks',
  'nextjs': 'frameworks',
  'nestjs': 'frameworks',
  'spring': 'frameworks',
  'springboot': 'frameworks',
  'spring-boot': 'frameworks',
  'spring-cloud-gateway': 'frameworks',
  'spring-gateway': 'frameworks',
  'spring-security': 'frameworks',
  'spring-webflux': 'frameworks',
  'dotnet': 'frameworks',
  'dotnet10': 'frameworks',
  'fastapi': 'frameworks',
  'flask': 'frameworks',
  'gin': 'frameworks',
  'echo': 'frameworks',
  'fiber': 'frameworks',
  'django': 'frameworks',
  'express': 'frameworks',
  'laravel': 'frameworks',
  'svelte': 'frameworks',
  'angular': 'frameworks',

  // Data & AI
  'mongodb': 'data-ai',
  'mongodb-atlas': 'data-ai',
  'postgresql': 'data-ai',
  'postgres': 'data-ai',
  'mysql': 'data-ai',
  'sqlite': 'data-ai',
  'redis': 'data-ai',
  'kafka': 'data-ai',
  'vector-database': 'data-ai',
  'cloudflare-vectorize': 'data-ai',
  'ollama': 'data-ai',
  'blip': 'data-ai',
  'ocr': 'data-ai',
  'elasticsearch': 'data-ai',
  'machine-learning': 'data-ai',
  'ai': 'data-ai',
  'llm': 'data-ai',

  // Architecture & Protocols
  'websocket': 'architecture',
  'serverless': 'architecture',
  'worker-service': 'architecture',
  'smtp': 'architecture',
  'grpc': 'architecture',
  'rest-api': 'architecture',
  'microservices': 'architecture',
  'graphql': 'architecture',
  'api': 'architecture',

  // Observability, Tools & Ecosystem
  'grafana': 'tools',
  'prometheus': 'tools',
  'keda': 'tools',
  'telegram': 'tools',
  'bot': 'tools',
  'discord': 'tools',
  'cli': 'tools',
  'automation': 'tools',
  'crawler': 'tools',
  'scraper': 'tools',
  'demo': 'tools',
  'open-source': 'tools',
}

export const useTopicTaxonomy = () => {
  const { resolveParentKey } = useTopicColors()

  /**
   * 根據 topic 名稱判斷其所屬的大類 ID
   */
  const getTopicCategoryId = (topic: string): string => {
    const rawKey = topic.toLowerCase()
    if (topicCategoryMap[rawKey]) {
      return topicCategoryMap[rawKey]
    }

    // 嘗試父系 key
    const parentKey = resolveParentKey(topic)
    if (topicCategoryMap[parentKey]) {
      return topicCategoryMap[parentKey]
    }

    // 前綴與詞素匹配（以 '-' 分隔，避免子字串誤判，例如避免 'ai' 匹配到 'fastapi'）
    const parts = rawKey.split('-')
    for (const part of parts) {
      if (topicCategoryMap[part]) {
        return topicCategoryMap[part]
      }
    }

    for (const [key, cat] of Object.entries(topicCategoryMap)) {
      if (rawKey.startsWith(key + '-')) {
        return cat
      }
    }

    // 預設落入 tools
    return 'tools'
  }

  return {
    categories: TOPIC_CATEGORIES,
    getTopicCategoryId,
  }
}
