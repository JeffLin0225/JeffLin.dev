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
  const getTopicColor = (topic: string): string => {
    return topicColors[topic.toLowerCase()] || hashTopicColor(topic)
  }

  return { getTopicColor }
}
