<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Hero 背景：會「呼吸」的點陣
 *
 * 灰點的亮度由幾道緩慢移動的正弦波疊加決定，看起來像風吹過草地；
 * 游標附近的點會轉成 Nuxt 綠。刻意不用模糊光球 —— 那是最容易讓網站看起來
 * 像 AI 模板的元素，點陣比較符合整站的 terminal 調性。
 *
 * 效能：Canvas 2D、限 30fps、離開畫面或分頁隱藏時暫停；
 * prefers-reduced-motion 時只畫一張靜態圖。
 */

const SPACING = 24
const FRAME_MS = 1000 / 30
const CURSOR_RADIUS = 180
const NUXT_GREEN = [0, 220, 130] as const

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let rafId = 0
let lastFrame = 0
let visible = true
let reducedMotion = false

// 游標實際位置與平滑後的位置（lerp 讓綠光有一點拖曳感，不會死黏著游標）
const pointer = { x: -9999, y: -9999 }
const smooth = { x: -9999, y: -9999, strength: 0 }
let pointerInside = false

const resize = () => {
  const el = canvas.value
  if (!el || !ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = el.clientWidth
  height = el.clientHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const draw = (t: number) => {
  if (!ctx) return
  const time = t / 1000

  smooth.x += (pointer.x - smooth.x) * 0.12
  smooth.y += (pointer.y - smooth.y) * 0.12
  smooth.strength += ((pointerInside ? 1 : 0) - smooth.strength) * 0.06

  ctx.clearRect(0, 0, width, height)

  const cols = Math.ceil(width / SPACING) + 1
  const rows = Math.ceil(height / SPACING) + 1
  const offsetX = (width - (cols - 1) * SPACING) / 2
  const offsetY = (height - (rows - 1) * SPACING) / 2

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * SPACING
      const y = offsetY + row * SPACING

      // 三道不同方向、不同速度的波疊加，結果落在 0..1
      const wave =
        Math.sin(col * 0.21 + time * 0.35) +
        Math.sin(row * 0.27 - time * 0.25) +
        Math.sin((col + row) * 0.12 + time * 0.18)
      const v = (wave + 3) / 6

      let alpha = 0.05 + v * v * 0.16
      let radius = 0.7 + v * 0.5
      let green = 0

      if (smooth.strength > 0.01) {
        const dx = x - smooth.x
        const dy = y - smooth.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_RADIUS) {
          const k = (1 - dist / CURSOR_RADIUS) ** 2 * smooth.strength
          green = k
          alpha += k * 0.55
          radius += k * 0.6
        }
      }

      if (green > 0.02) {
        const r = Math.round(255 + (NUXT_GREEN[0] - 255) * green)
        const g = Math.round(255 + (NUXT_GREEN[1] - 255) * green)
        const b = Math.round(255 + (NUXT_GREEN[2] - 255) * green)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
      }

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

const loop = (t: number) => {
  rafId = requestAnimationFrame(loop)
  if (!visible || t - lastFrame < FRAME_MS) return
  lastFrame = t
  draw(t)
}

const onPointerMove = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  pointer.x = e.clientX - rect.left
  pointer.y = e.clientY - rect.top
  pointerInside = pointer.y >= 0 && pointer.y <= rect.height
  // 第一次進入時直接定位，避免綠光從畫面外飛進來
  if (smooth.strength < 0.01) {
    smooth.x = pointer.x
    smooth.y = pointer.y
  }
}

const onPointerLeave = () => { pointerInside = false }

let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  ctx = canvas.value?.getContext('2d') ?? null
  if (!ctx || !canvas.value) return

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resizeObserver = new ResizeObserver(() => {
    resize()
    if (reducedMotion) draw(0)
  })
  resizeObserver.observe(canvas.value)
  resize()

  if (reducedMotion) {
    draw(0)
    return
  }

  observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting })
  observer.observe(canvas.value)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  resizeObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('pointerleave', onPointerLeave)
})
</script>
