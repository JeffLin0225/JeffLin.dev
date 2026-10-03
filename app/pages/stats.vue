<template>
  <div class="container-main py-20">
    <!-- ─── Header ─── -->
    <header class="mb-12 animate-fade-up">
      <h1 class="font-display text-4xl font-bold tracking-tight mb-3">
        網站流量
      </h1>
      <p class="text-text-secondary max-w-2xl">
        這個頁面的資料由我自己寫的統計系統收集，公開展示。
        <span class="text-text-muted">刻意不收集 IP 位址 —— 原因寫在下面。</span>
      </p>
      <p v-if="stats?.updatedAt" class="mt-3 font-mono text-xs text-text-muted">
        最後更新 {{ formatUpdatedAt(stats.updatedAt) }} · 每 10 分鐘重新計算
      </p>
    </header>

    <!-- ─── 未設定查詢憑證 ─── -->
    <!-- 這是公開頁面，正式環境不報出環境變數名稱，只在開發模式顯示 -->
    <div
      v-if="stats && !stats.configured"
      class="mb-10 px-4 py-3 rounded-sm border border-status-warning/30 bg-status-warning/5"
    >
      <p v-if="isDev" class="font-mono text-xs text-status-warning">
        查詢憑證未設定（NUXT_CF_ACCOUNT_ID / NUXT_CF_ANALYTICS_TOKEN），顯示空資料
      </p>
      <p v-else class="font-mono text-xs text-status-warning">
        統計資料準備中
      </p>
    </div>

    <!-- ─── 查詢失敗 ─── -->
    <div
      v-else-if="hasError"
      class="mb-10 px-4 py-3 rounded-sm border border-status-error/30 bg-status-error/5"
    >
      <p class="font-mono text-xs text-status-error">
        統計資料暫時無法取得，請稍後再試
      </p>
    </div>

    <!-- ─── 三個主要數字 ─── -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
      <div
        v-for="(tile, i) in tiles"
        :key="tile.label"
        class="p-6 rounded-card border border-border-subtle bg-surface-secondary animate-fade-up"
        :class="`stagger-${i + 1}`"
      >
        <p class="font-mono text-xs uppercase tracking-wider text-text-muted mb-2">
          {{ tile.label }}
        </p>
        <p class="font-display text-3xl font-bold tabular-nums">
          {{ formatNumber(tile.value) }}
        </p>
        <p class="mt-1 text-xs text-text-muted">{{ tile.hint }}</p>
      </div>
    </section>

    <!-- ─── 空資料狀態 ─── -->
    <section
      v-if="isEmpty"
      class="mb-14 px-6 py-16 rounded-card border border-border-subtle bg-surface-secondary text-center"
    >
      <h2 class="font-display text-lg font-semibold mb-2">尚無流量資料</h2>
      <p class="text-text-secondary text-sm">
        統計系統剛上線，資料累積中。下方仍可閱讀它的運作方式。
      </p>
    </section>

    <template v-else>
      <!-- ─── 近 30 天趨勢 ─── -->
      <section class="mb-14">
        <h2 class="font-display text-lg font-semibold mb-5">近 30 天</h2>
        <div class="p-6 rounded-card border border-border-subtle bg-surface-secondary">
          <div class="flex items-end gap-[3px] h-36">
            <div
              v-for="day in trend"
              :key="day.day"
              class="flex-1 min-w-0 rounded-sm bg-white/15 transition-colors duration-fast hover:bg-white/40"
              :style="{ height: barHeight(day.views) }"
              :title="`${day.day} — ${day.views} 次瀏覽 / ${day.visitors} 位訪客`"
            />
          </div>
          <div class="flex justify-between mt-3 font-mono text-[10px] text-text-muted">
            <span>{{ trend[0]?.day }}</span>
            <span>{{ trend[trend.length - 1]?.day }}</span>
          </div>
        </div>
      </section>

      <!-- ─── 頁面與來源 ─── -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatsBarList title="熱門頁面" :rows="pageRows" empty-text="尚無資料" />
        <StatsBarList title="流量來源" :rows="referrerRows" empty-text="目前全部是直接訪問" />
      </section>

      <!-- ─── 地區與裝置 ─── -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <StatsBarList title="國家 / 地區" :rows="countryRows" empty-text="尚無資料" />
        <StatsBarList title="裝置" :rows="deviceRows" empty-text="尚無資料" />
      </section>
    </template>

    <!-- ─── 這是怎麼做的 ─── -->
    <section class="p-6 sm:p-8 rounded-card border border-border-subtle bg-surface-secondary">
      <h2 class="font-display text-lg font-semibold mb-5">這是怎麼做的</h2>

      <div class="font-mono text-xs text-text-secondary leading-relaxed mb-7 overflow-x-auto">
        <pre class="whitespace-pre">瀏覽器 beacon ──► /api/track ──► Analytics Engine
                                       │
                /stats ◄── KV 快取 ◄── SQL API</pre>
      </div>

      <div class="space-y-5 text-sm text-text-secondary">
        <div>
          <h3 class="font-display text-text-primary font-medium mb-1">收集方式</h3>
          <p>
            首頁是 prerender 的靜態檔，由 CDN 邊緣直接回應、不會進入伺服器，
            所以統計不能做在 server middleware —— 會漏掉流量最大的那一頁。
            改由前端在每次路由變化時送一個 beacon 到
            <code class="font-mono text-text-primary">/api/track</code>，
            再寫入 Cloudflare Analytics Engine。
          </p>
        </div>

        <div>
          <h3 class="font-display text-text-primary font-medium mb-1">為什麼不收集 IP</h3>
          <p>
            這個頁面是公開的。IP 只在請求處理的瞬間用來算一個每日輪替的匿名雜湊，
            算完立刻丟棄，從不寫入任何儲存 —— 而不是「存了但不顯示」。
            後者只要哪天某個 endpoint 寫錯就會洩漏，前者在資料結構上就不可能。
          </p>
        </div>

        <div>
          <h3 class="font-display text-text-primary font-medium mb-1">另外三樣刻意不顯示的東西</h3>
          <ul class="list-none space-y-1.5 mt-2">
            <li class="flex gap-2">
              <span class="text-text-muted shrink-0">—</span>
              <span><span class="text-text-primary">城市</span>：流量不大時，「台北市 · 2 分鐘前 · /github」等於在指認一個人，所以地理只到國家層級。</span>
            </li>
            <li class="flex gap-2">
              <span class="text-text-muted shrink-0">—</span>
              <span><span class="text-text-primary">即時訪客列表</span>：時間加來源加頁面組合起來就是追蹤記錄，所以只放聚合數字。</span>
            </li>
            <li class="flex gap-2">
              <span class="text-text-muted shrink-0">—</span>
              <span><span class="text-text-primary">完整 referrer 網址</span>：會洩漏訪客端的內部網址（私人筆記頁、公司工具、帶 token 的連結），所以只留 hostname。</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-display text-text-primary font-medium mb-1">關於數字的誠實說明</h3>
          <p>
            Analytics Engine 在高流量時會自動降採樣，查詢用
            <code class="font-mono text-text-primary">SUM(_sample_interval)</code>
            加權還原。以本站的規模幾乎不會觸發，但「不重複訪客」仍應理解為估計值而非精確值。
            訪客雜湊每日輪替，因此無法跨日追蹤，也算不出回訪者 —— 這是刻意的取捨。
          </p>
        </div>

        <div>
          <h3 class="font-display text-text-primary font-medium mb-1">不使用 cookie</h3>
          <p>
            整套機制不寫入 cookie 或 localStorage，也尊重瀏覽器的 Do Not Track 設定。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/* ─── SEO ─── */
useSeoMeta({
  title: '網站流量 — Jeff Lin',
  description: '公開的 jxlin.dev 流量統計，由自建的分析系統收集 —— 不收集 IP 位址。',
})

const { stats, hasError, isEmpty, trend, trendMax, fetchStats } = useSiteStats()

await fetchStats()

const isDev = import.meta.dev

/* ─── 三個主要數字 ─── */
const tiles = computed(() => [
  {
    label: '瀏覽量',
    value: stats.value?.totals.views30d ?? 0,
    hint: '近 30 天',
  },
  {
    label: '不重複訪客',
    value: stats.value?.totals.visitors30d ?? 0,
    hint: '近 30 天，估計值',
  },
  {
    label: '瀏覽量',
    value: stats.value?.totals.views24h ?? 0,
    hint: '過去 24 小時',
  },
])

/* ─── 比例條資料 ─── */
const pageRows = computed(() =>
  stats.value?.topPages.map(p => ({ key: p.path, label: p.path, value: p.views })) ?? [],
)

const referrerRows = computed(() =>
  stats.value?.topReferrers.map(r => ({ key: r.host, label: r.host, value: r.views })) ?? [],
)

const countryRows = computed(() =>
  stats.value?.countries.map(c => ({
    key: c.code,
    label: `${flagEmoji(c.code)} ${c.code}`,
    value: c.views,
  })) ?? [],
)

const deviceRows = computed(() =>
  stats.value?.devices.map(d => ({ key: d.type, label: d.type, value: d.views })) ?? [],
)

/* ─── 趨勢長條高度（最小 2% 讓零值仍看得見基線）─── */
const barHeight = (views: number): string => {
  if (views === 0) return '2%'
  return `${Math.max(4, (views / trendMax.value) * 100)}%`
}

/* ─── 國碼轉旗幟 emoji（regional indicator symbols）─── */
const flagEmoji = (code: string): string => {
  if (!/^[A-Z]{2}$/.test(code)) return '🌐'
  return String.fromCodePoint(
    ...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65),
  )
}

const formatNumber = (n: number): string => n.toLocaleString('en-US')

const formatUpdatedAt = (iso: string): string =>
  new Date(iso).toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>
