<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Hero 背景：ASCII 字元場
 *
 * 平常是一片很淡、偶爾才換字的終端機字元（每 ~300ms 更新一次，是「跳」不是「流」）；
 * 游標掃過的地方會浮現 Nuxt 綠的程式碼 —— 內容是這個網站自己的原始碼片段 —— 再慢慢退回去。
 *
 * 效能：背景字元畫在離屏 canvas，只在換字時重畫；每幀只補畫游標附近有熱度的格子。
 */

const FONT_SIZE = 13
const CELL_H = 20
const AMBIENT_MS = 320
const CURSOR_RADIUS = 150
const HEAT_DECAY = 0.955
const RAMP = '    ..:·-+'

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
let ambient: HTMLCanvasElement | null = null
let lastAmbient = -Infinity

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

/** 低頻、緩慢漂移的場，決定背景字元的密度 */
const field = (c: number, r: number, t: number) => {
  const v =
    Math.sin(c * 0.09 + t * 0.05) +
    Math.sin(r * 0.21 - t * 0.04) +
    Math.sin((c * 0.6 + r) * 0.07 + t * 0.03)
  return (v + 3) / 6
}

const drawAmbient = (width: number, height: number, time: number) => {
  if (!ambient) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  ambient.width = Math.round(width * dpr)
  ambient.height = Math.round(height * dpr)
  const a = ambient.getContext('2d')!
  a.setTransform(dpr, 0, 0, dpr, 0, 0)
  a.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
  a.textBaseline = 'middle'

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = field(c, r, time)
      // 加一點每格固定的擾動，避免出現整齊的條紋
      const jitter = ((c * 73856093) ^ (r * 19349663)) % 7 / 40
      const idx = Math.floor(Math.min(0.999, Math.max(0, v - 0.2 + jitter)) * RAMP.length)
      const ch = RAMP[idx]
      if (!ch || ch === ' ') continue
      a.fillStyle = `rgba(255,255,255,${0.03 + v * 0.07})`
      a.fillText(ch, c * cellW, r * CELL_H + CELL_H / 2)
    }
  }
}

useCanvasBackdrop(canvas, ({ ctx, width, height, time, pointer, resized }) => {
  if (resized) {
    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
    cellW = Math.ceil(ctx.measureText('M').width)
    cols = Math.ceil(width / cellW)
    rows = Math.ceil(height / CELL_H)
    heat = new Float32Array(cols * rows)
    ambient ??= document.createElement('canvas')
    buildRows()
    lastAmbient = -Infinity
  }

  // 背景字元：低頻更新，像終端機刷新畫面
  if (time * 1000 - lastAmbient > AMBIENT_MS) {
    drawAmbient(width, height, time)
    lastAmbient = time * 1000
  }

  // 熱度：游標附近升溫，其餘慢慢冷卻
  const reach = CURSOR_RADIUS * pointer.strength
  const c0 = Math.max(0, Math.floor((pointer.x - reach) / cellW))
  const c1 = Math.min(cols - 1, Math.ceil((pointer.x + reach) / cellW))
  const r0 = Math.max(0, Math.floor((pointer.y - reach) / CELL_H))
  const r1 = Math.min(rows - 1, Math.ceil((pointer.y + reach) / CELL_H))
  for (let i = 0; i < heat.length; i++) heat[i]! *= HEAT_DECAY
  if (reach > 1) {
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
  if (ambient) ctx.drawImage(ambient, 0, 0, width, height)

  ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
  ctx.textBaseline = 'middle'
  for (let r = 0; r < rows; r++) {
    const line = rowText[r]!
    for (let c = 0; c < cols; c++) {
      const h = heat[r * cols + c]!
      if (h < 0.04) continue
      const ch = line[c]
      if (!ch || ch === ' ') continue
      const x = c * cellW
      const y = r * CELL_H
      // 先蓋掉底下的背景字元，再寫程式碼
      ctx.fillStyle = 'rgb(10,10,10)'
      ctx.fillRect(x, y + 3, cellW, CELL_H - 6)
      ctx.fillStyle = `rgba(0,220,130,${Math.min(1, h * 1.3) * 0.85})`
      ctx.fillText(ch, x, y + CELL_H / 2)
    }
  }
}, { fps: 30 })
</script>
