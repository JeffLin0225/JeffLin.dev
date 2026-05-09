<template>
  <section id="hero-section" class="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
    <!-- Grid background (hacker aesthetic) -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0 grid-bg animate-grid-pulse" />
      <div class="absolute inset-0 bg-radial-fade" />
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <!-- Terminal greeting -->
      <div class="font-mono text-sm text-text-muted mb-6 animate-fade-up">
        <span class="text-text-muted/60">$</span> whoami
      </div>

      <!-- Main title -->
      <h1 class="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-4 animate-fade-up stagger-1">
        Hi, I'm
        <span class="relative inline-block">
          Jeff Lin
          <span class="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-border-accent to-transparent" />
        </span>
      </h1>

      <!-- Typing subtitle -->
      <div class="font-mono text-lg md:text-xl text-text-secondary mb-8 animate-fade-up stagger-2 h-8 flex items-center justify-center">
        <span class="text-text-muted/60 mr-2">&gt;</span>
        <span ref="typedTextEl">{{ displayedText }}</span>
        <span class="inline-block w-[2px] h-5 bg-text-primary ml-0.5 animate-blink" />
      </div>

      <!-- Subtitle description -->
      <p class="text-text-muted text-sm md:text-base font-light max-w-lg mx-auto mb-10 animate-fade-up stagger-3">
        用現代網路技術打造數位體驗。
        <br class="hidden md:block" />
        乾淨的程式碼、深思熟慮的設計、流暢的效能。
      </p>

      <!-- CTA Buttons -->
      <div class="flex items-center justify-center gap-4 animate-fade-up stagger-4">
        <NuxtLink
          to="/github"
          class="px-6 py-3 bg-white text-surface-primary font-display text-sm font-medium rounded-sm border border-transparent transition-[background,transform] duration-fast hover:bg-neutral-200 active:scale-[0.97]"
        >
          探索專案
        </NuxtLink>
        <a
          href="https://github.com/Jefflin0225"
          target="_blank"
          rel="noopener noreferrer"
          class="px-6 py-3 border border-border-default font-display text-sm font-medium text-text-primary rounded-sm transition-[border-color,background] duration-fast hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]"
        >
          <span class="font-mono text-text-muted text-xs mr-1.5">↗</span>
          GitHub
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-5">
      <span class="font-mono text-xs text-text-muted/40">scroll</span>
      <div class="w-px h-8 bg-gradient-to-b from-border-default to-transparent animate-float" />
    </div>
  </section>
</template>

<script setup lang="ts">
const displayedText = ref('')
const typedTextEl = ref<HTMLSpanElement | null>(null)

const phrases = [
  'Full-Stack Developer',
  'Vue / Nuxt 愛好者',
  'Cloudflare Builder',
  'Open Source Contributor',
]

let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

const typeSpeed = 80
const deleteSpeed = 40
const pauseEnd = 2000
const pauseStart = 500

const tick = () => {
  const currentPhrase = phrases[phraseIndex]

  if (!isDeleting) {
    displayedText.value = currentPhrase.slice(0, charIndex + 1)
    charIndex++

    if (charIndex >= currentPhrase.length) {
      isDeleting = true
      timeoutId = setTimeout(tick, pauseEnd)
      return
    }
    timeoutId = setTimeout(tick, typeSpeed)
  } else {
    displayedText.value = currentPhrase.slice(0, charIndex - 1)
    charIndex--

    if (charIndex <= 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      timeoutId = setTimeout(tick, pauseStart)
      return
    }
    timeoutId = setTimeout(tick, deleteSpeed)
  }
}

onMounted(() => {
  timeoutId = setTimeout(tick, 800)
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.grid-bg {
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.04;
}

.bg-radial-fade {
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    transparent 0%,
    var(--bg-primary) 100%
  );
}
</style>
