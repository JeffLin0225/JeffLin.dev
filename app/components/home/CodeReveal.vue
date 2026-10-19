<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Hero 背景：游標掃過時浮現程式碼
 *
 * 平常什麼都沒有；游標經過的地方會浮現 Nuxt 綠的程式碼 —— 內容是這個網站
 * 自己的原始碼片段 —— 離開後約一秒淡掉。沒有游標（手機、reduced-motion）時就是空白。
 *
 * 實作：畫面切成等寬字元格，每格有一個「熱度」，游標附近升溫、其餘逐幀冷卻，
 * 只畫熱度夠高的格子。
 */

const FONT_SIZE = 13
const CELL_H = 20
const CURSOR_RADIUS = 150
const HEAT_DECAY = 0.955

// 只放 ASCII（中文是全形，會撐破格子）；全部是本站真實存在的程式碼
const CODE = [
  `export default defineNuxtConfig({`,
  `modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'],`,
  `nitro: { preset: 'cloudflare_module' },`,
  `nitroApp.hooks.hook('cloudflare:scheduled', async ({ controller, env }) => {`,
  `case STATS_CRON: await refreshStatsCache(kv, creds)`,
  `case REPOS_CRON: await refreshReposCache(kv, token)`,
  `const cached = await readStatsCache(kv)`,
  `if (cached) return cached`,
  `SELECT blob1 AS path, SUM(_sample_interval) AS views`,
  `dataset.writeDataPoint({ blobs, doubles: [1], indexes })`,
  `const visitor = await hashVisitor(ip, ua, salt, taipeiDay())`,
  `const fuse = computed(() => new Fuse(repos.value, fuseOptions))`,
  'ogImage: `${SITE_URL}/og.png`,',
  `'/craditCard': { redirect: { to: '/credit-card', statusCode: 301 } },`,
  `if (isBot(ua)) return sendNoContent(event, 204)`,
  `await kv.put(STATS_CACHE_KEY, JSON.stringify(payload))`,
]

const canvas = ref<HTMLCanvasElement | null>(null)

let cellW = 8
let cols = 0
let rows = 0
let heat = new Float32Array(0)
let rowText: string[] = []

/** 每列是一段接起來的程式碼，各列起點錯開，掃過時讀起來像編輯器裡的不同行 */
const buildRows = () => {
  rowText = Array.from({ length: rows }, (_, r) => {
    let text = ''
    let i = (r * 5) % CODE.length
    while (text.length < cols + 40) {
      text += CODE[i % CODE.length] + '    '
      i++
    }
    const shift = (r * 17) % 23
    return text.slice(shift, shift + cols)
  })
}

useCanvasBackdrop(canvas, ({ ctx, width, height, pointer, resized }) => {
  ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
  ctx.textBaseline = 'middle'

  if (resized) {
    cellW = Math.ceil(ctx.measureText('M').width)
    cols = Math.ceil(width / cellW)
    rows = Math.ceil(height / CELL_H)
    heat = new Float32Array(cols * rows)
    buildRows()
  }

  // 熱度：游標附近升溫，其餘慢慢冷卻
  for (let i = 0; i < heat.length; i++) heat[i]! *= HEAT_DECAY
  const reach = CURSOR_RADIUS * pointer.strength
  if (reach > 1) {
    const c0 = Math.max(0, Math.floor((pointer.x - reach) / cellW))
    const c1 = Math.min(cols - 1, Math.ceil((pointer.x + reach) / cellW))
    const r0 = Math.max(0, Math.floor((pointer.y - reach) / CELL_H))
    const r1 = Math.min(rows - 1, Math.ceil((pointer.y + reach) / CELL_H))
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const dx = c * cellW + cellW / 2 - pointer.x
        const dy = r * CELL_H + CELL_H / 2 - pointer.y
        const k = 1 - Math.sqrt(dx * dx + dy * dy) / reach
        const i = r * cols + c
        if (k > heat[i]!) heat[i] = k
      }
    }
  }

  ctx.clearRect(0, 0, width, height)
  for (let r = 0; r < rows; r++) {
    const line = rowText[r]!
    for (let c = 0; c < cols; c++) {
      const h = heat[r * cols + c]!
      if (h < 0.04) continue
      const ch = line[c]
      if (!ch || ch === ' ') continue
      ctx.fillStyle = `rgba(0,220,130,${Math.min(1, h * 1.3) * 0.85})`
      ctx.fillText(ch, c * cellW, r * CELL_H + CELL_H / 2)
    }
  }
}, { fps: 30 })
</script>
