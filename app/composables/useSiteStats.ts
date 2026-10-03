export interface SiteStats {
  updatedAt: string | null
  configured: boolean
  totals: { views30d: number; visitors30d: number; views24h: number }
  byDay: Array<{ day: string; views: number; visitors: number }>
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ host: string; views: number }>
  countries: Array<{ code: string; views: number }>
  devices: Array<{ type: string; views: number }>
}

/**
 * 公開流量統計資料管理
 * 資料來自 /api/stats（經 KV 快取，10 分鐘更新一次）
 */
export const useSiteStats = () => {
  const stats = useState<SiteStats | null>('site-stats', () => null)
  const isLoading = useState<boolean>('site-stats-loading', () => false)
  const hasError = useState<boolean>('site-stats-error', () => false)

  /* ─── 是否完全沒有資料（剛上線時全是 0）─── */
  const isEmpty = computed(() =>
    !stats.value || stats.value.totals.views30d === 0,
  )

  /* ─── 趨勢圖用：補齊近 30 天缺漏的日期，避免長條圖出現空洞 ─── */
  const trend = computed(() => {
    const byDay = new Map(stats.value?.byDay.map(d => [d.day, d]) ?? [])
    const days: Array<{ day: string; views: number; visitors: number }> = []

    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      days.push(byDay.get(date) ?? { day: date, views: 0, visitors: 0 })
    }

    return days
  })

  /* ─── 長條圖縮放基準 ─── */
  const trendMax = computed(() =>
    Math.max(1, ...trend.value.map(d => d.views)),
  )

  const fetchStats = async () => {
    const config = useRuntimeConfig()

    const { data, error, pending } = await useAsyncData('site-stats', () =>
      $fetch<SiteStats>('/api/stats', {
        headers: {
          'x-internal-token': config.public.internalApiToken,
        },
      }),
      { lazy: true },
    )

    watch(pending, (val) => { isLoading.value = val }, { immediate: true })

    watch(data, (val) => {
      if (val) {
        stats.value = val
        hasError.value = false
      }
    }, { immediate: true })

    watch(error, (val) => {
      if (val) {
        console.error('[useSiteStats] Fetch error:', val)
        hasError.value = true
      }
    }, { immediate: true })
  }

  return {
    stats,
    isLoading,
    hasError,
    isEmpty,
    trend,
    trendMax,
    fetchStats,
  }
}
