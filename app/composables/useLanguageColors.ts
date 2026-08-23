/**
 * 共用語言顏色對照表
 * SearchHero & RepoCard 共用，集中管理語言代表色
 */

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#FF0000',
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
  Jupyter: '#DA5B0B',
  HCL: '#844FBA',
}

export const useLanguageColors = () => {
  const getLanguageColor = (lang: string | null): string => {
    if (!lang) return '#8b8b8b'
    return languageColors[lang] || '#8b8b8b'
  }

  return { languageColors, getLanguageColor }
}
