<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Hero 背景：等高線地形圖
 *
 * 一張緩慢變形的地形，用 marching squares 畫出等高線；
 * 游標所在處會隆起一座小山，那一帶的線條轉成 Nuxt 綠。
 *
 * 地形本身變化極慢（幾十秒才看得出差異），主要的動態來自游標互動。
 */

const STEP = 10
const LEVELS = 11
const HILL_RADIUS = 150
const HILL_HEIGHT = 0.4

const canvas = ref<HTMLCanvasElement | null>(null)

let cols = 0
let rows = 0
let values = new Float32Array(0)

/** 幾道不同方向的低頻波疊成地形，結果大致落在 0..1 */
const terrain = (x: number, y: number, t: number) => {
  const v =
    Math.sin(x * 0.0042 + t * 0.020) * Math.cos(y * 0.0061 - t * 0.015) +
    0.6 * Math.sin((x + y) * 0.0035 - t * 0.012) +
    0.35 * Math.cos((x * 0.8 - y) * 0.0087 + t * 0.018)
  return (v + 1.95) / 3.9
}

useCanvasBackdrop(canvas, ({ ctx, width, height, time, pointer, resized }) => {
  if (resized) {
    cols = Math.ceil(width / STEP) + 1
    rows = Math.ceil(height / STEP) + 1
    values = new Float32Array(cols * rows)
  }

  // 取樣：地形 + 游標小山（高斯）
  const sigma2 = 2 * (HILL_RADIUS / 2) ** 2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * STEP
      const y = r * STEP
      let v = terrain(x, y, time)
      if (pointer.strength > 0.01) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        v += HILL_HEIGHT * pointer.strength * Math.exp(-(dx * dx + dy * dy) / sigma2)
      }
      values[r * cols + c] = v
    }
  }

  // marching squares：每個等高值走一遍所有格子，線段全部收進同一條 path
  ctx.beginPath()
  for (let l = 1; l <= LEVELS; l++) {
    const iso = l / (LEVELS + 1)
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const a = values[r * cols + c]!
        const b = values[r * cols + c + 1]!
        const d = values[(r + 1) * cols + c]!
        const e = values[(r + 1) * cols + c + 1]!
        const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (e > iso ? 2 : 0) | (d > iso ? 1 : 0)
        if (idx === 0 || idx === 15) continue

        const x = c * STEP
        const y = r * STEP
        // 四條邊上的交點（線性內插）
        const top = () => [x + STEP * (iso - a) / (b - a), y] as const
        const right = () => [x + STEP, y + STEP * (iso - b) / (e - b)] as const
        const bottom = () => [x + STEP * (iso - d) / (e - d), y + STEP] as const
        const left = () => [x, y + STEP * (iso - a) / (d - a)] as const
        const seg = (p: readonly [number, number], q: readonly [number, number]) => {
          ctx.moveTo(p[0], p[1])
          ctx.lineTo(q[0], q[1])
        }

        switch (idx) {
          case 1: case 14: seg(left(), bottom()); break
          case 2: case 13: seg(bottom(), right()); break
          case 3: case 12: seg(left(), right()); break
          case 4: case 11: seg(top(), right()); break
          case 6: case 9: seg(top(), bottom()); break
          case 7: case 8: seg(left(), top()); break
          case 5: seg(left(), top()); seg(bottom(), right()); break
          case 10: seg(left(), bottom()); seg(top(), right()); break
        }
      }
    }
  }

  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,0.075)'
  ctx.stroke()

  // 同一條 path 再描一次，筆刷換成以游標為中心的綠色放射漸層
  if (pointer.strength > 0.01) {
    const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, HILL_RADIUS * 1.4)
    g.addColorStop(0, `rgba(0,220,130,${0.75 * pointer.strength})`)
    g.addColorStop(1, 'rgba(0,220,130,0)')
    ctx.strokeStyle = g
    ctx.stroke()
  }
}, { fps: 30 })
</script>
