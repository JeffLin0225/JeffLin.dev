import type { Ref } from 'vue'

/**
 * Hero 背景 canvas 的共用骨架
 *
 * 負責所有跟「畫什麼」無關的事：DPR 縮放、尺寸變化、限制 fps、
 * 離開畫面 / 分頁隱藏時暫停、prefers-reduced-motion 只畫一張靜態圖、
 * 以及平滑後的游標位置（lerp 讓互動有一點拖曳感，不會死黏著游標）。
 */

export interface BackdropFrame {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  /** 秒 */
  time: number
  /** 平滑後的游標座標（canvas 內座標）；strength 0..1，游標離開時漸弱 */
  pointer: { x: number; y: number; strength: number }
  /** 此 canvas 尺寸是否剛改變（給需要重建快取的背景用） */
  resized: boolean
}

export const useCanvasBackdrop = (
  canvas: Ref<HTMLCanvasElement | null>,
  draw: (frame: BackdropFrame) => void,
  { fps = 30 }: { fps?: number } = {},
) => {
  const frameMs = 1000 / fps

  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let resized = true
  let rafId = 0
  let lastFrame = 0
  let visible = true

  const target = { x: -9999, y: -9999, inside: false }
  const pointer = { x: -9999, y: -9999, strength: 0 }

  const resize = () => {
    const el = canvas.value
    if (!el || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = el.clientWidth
    height = el.clientHeight
    el.width = Math.round(width * dpr)
    el.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    resized = true
  }

  const render = (t: number) => {
    if (!ctx) return
    pointer.x += (target.x - pointer.x) * 0.14
    pointer.y += (target.y - pointer.y) * 0.14
    pointer.strength += ((target.inside ? 1 : 0) - pointer.strength) * 0.06
    draw({ ctx, width, height, time: t / 1000, pointer, resized })
    resized = false
  }

  const loop = (t: number) => {
    rafId = requestAnimationFrame(loop)
    if (!visible || t - lastFrame < frameMs) return
    lastFrame = t
    render(t)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const rect = canvas.value?.getBoundingClientRect()
    if (!rect) return
    target.x = e.clientX - rect.left
    target.y = e.clientY - rect.top
    target.inside = target.y >= 0 && target.y <= rect.height
    // 第一次進入直接定位，避免效果從畫面外飛進來
    if (pointer.strength < 0.01) {
      pointer.x = target.x
      pointer.y = target.y
    }
  }
  const onPointerLeave = () => { target.inside = false }

  let observer: IntersectionObserver | null = null
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    ctx = canvas.value?.getContext('2d') ?? null
    if (!ctx || !canvas.value) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion) render(0)
    })
    resizeObserver.observe(canvas.value)
    resize()

    if (reducedMotion) {
      render(0)
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
}
