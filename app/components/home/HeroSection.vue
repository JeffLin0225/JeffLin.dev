<template>
  <section id="hero-section" class="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
    <!-- Grid background -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0 grid-bg animate-grid-pulse" />
      <div class="absolute inset-0 bg-radial-fade" />
    </div>

    <!-- Layout: 4 cards surrounding the central bio -->
    <div class="relative z-10 w-full container-main px-4">
      <div class="hero-grid">

        <!-- Top-Left Card -->
        <NuxtLink to="/github" class="nav-card group card-tl">
          <div class="card-inner">
            <PuzzleCardHeader filename="github.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1">GitHub 專案</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">瀏覽與搜尋我的 Repositories。</p>
            <PuzzleCardFooter :tags="['repos', 'search']" />
          </div>
        </NuxtLink>

        <!-- Top-Right Card -->
        <NuxtLink to="/about" class="nav-card group card-tr">
          <div class="card-inner">
            <PuzzleCardHeader filename="skills.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1">關於我</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">了解我的背景與技術棧。</p>
            <PuzzleCardFooter :tags="['skills', 'stack']" />
          </div>
        </NuxtLink>

        <!-- Center Piece: Self Introduction -->
        <div class="hero-center">
          <div class="font-mono text-sm text-text-muted mb-4 animate-fade-up">
            <span class="text-text-muted/60">$</span> whoami
          </div>
          <h1 class="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-3 animate-fade-up stagger-1">
            Hi, I'm
            <span class="relative inline-block">
              Jeff Lin
              <span class="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-border-accent to-transparent" />
            </span>
          </h1>
          <div class="font-mono text-base md:text-lg text-text-secondary mb-5 animate-fade-up stagger-2 h-7 flex items-center justify-center">
            <span class="text-text-muted/60 mr-2">&gt;</span>
            <span>{{ displayedText }}</span>
            <span class="inline-block w-[2px] h-5 bg-text-primary ml-0.5 animate-blink" />
          </div>
          <p class="text-text-muted text-sm md:text-base font-light max-w-md mx-auto mb-8 animate-fade-up stagger-3">
            用現代網路技術打造數位體驗。
            <br class="hidden md:block" />
            乾淨的程式碼、深思熟慮的設計、流暢的效能。
          </p>
          <div class="flex items-center justify-center gap-4 animate-fade-up stagger-4">
            <NuxtLink
              to="/github"
              class="px-6 py-2.5 bg-white text-surface-primary font-display text-sm font-medium rounded-sm transition-[background,transform] duration-fast hover:bg-neutral-200 active:scale-[0.97]"
            >
              探索專案
            </NuxtLink>
            <a
              href="https://github.com/Jefflin0225"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-2.5 border border-border-default font-display text-sm font-medium text-text-primary rounded-sm transition-[border-color,background] duration-fast hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]"
            >
              <span class="font-mono text-text-muted text-xs mr-1.5">↗</span>GitHub
            </a>
          </div>
        </div>

        <!-- Bottom-Left Card -->
        <NuxtLink to="/contact" class="nav-card group card-bl">
          <div class="card-inner">
            <PuzzleCardHeader filename="contact.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1">聯繫方式</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">透過 GitHub 或 Email 聯繫我。</p>
            <PuzzleCardFooter :tags="['email', 'github']" />
          </div>
        </NuxtLink>

        <!-- Bottom-Right Card -->
        <NuxtLink to="/github" class="nav-card group card-br">
          <div class="card-inner">
            <PuzzleCardHeader filename="featured.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1">精選作品</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">全端應用與開源貢獻精選。</p>
            <PuzzleCardFooter :tags="['portfolio']" />
          </div>
        </NuxtLink>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const displayedText = ref('')
const phrases = [
  'Full-Stack Developer 全端開發',
  'Vue / Nuxt 愛好者',
  'Java / Spring Boot & Python / FastApi',
]
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

const tick = () => {
  const currentPhrase = phrases[phraseIndex] || ''
  if (!isDeleting) {
    displayedText.value = currentPhrase.slice(0, charIndex + 1)
    charIndex++
    if (charIndex >= currentPhrase.length) {
      isDeleting = true
      timeoutId = setTimeout(tick, 2000)
      return
    }
    timeoutId = setTimeout(tick, 80)
  } else {
    displayedText.value = currentPhrase.slice(0, charIndex - 1)
    charIndex--
    if (charIndex <= 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      timeoutId = setTimeout(tick, 500)
      return
    }
    timeoutId = setTimeout(tick, 20)
  }
}
onMounted(() => { timeoutId = setTimeout(tick, 800) })
onUnmounted(() => { if (timeoutId) clearTimeout(timeoutId) })
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
  background: radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--bg-primary) 100%);
}

/* ─── Hero Grid ─── */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 32px;
  align-items: center;
}
.card-tl { grid-column: 1; grid-row: 1; }
.card-tr { grid-column: 3; grid-row: 1; }
.card-bl { grid-column: 1; grid-row: 2; }
.card-br { grid-column: 3; grid-row: 2; }
.hero-center {
  grid-column: 2;
  grid-row: 1 / 3;
  text-align: center;
  padding: 2rem 1rem;
}

/* ─── Card Base ─── */
.nav-card {
  display: flex;
  text-decoration: none;
  height: 100%;
}
.card-inner {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem; /* 12px standard radius */
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    border-color 300ms ease,
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 300ms ease;
}

/* Hover effects */
.card-inner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}

.nav-card:hover .card-inner {
  border-color: var(--border-strong);
  transform: translateY(-5px);
  box-shadow: 0 12px 40px hsla(0, 0%, 0%, 0.6);
}
.nav-card:hover .card-inner::before {
  opacity: 1;
}

/* ─── Animations ─── */
.nav-card, .hero-center {
  animation: fadeUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.card-tl { animation-delay: 0.1s; }
.card-tr { animation-delay: 0.2s; }
.hero-center { animation-delay: 0s; }
.card-bl { animation-delay: 0.3s; }
.card-br { animation-delay: 0.4s; }

@keyframes fadeUpIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 20px;
  }
  .hero-center {
    grid-column: 1 / -1;
    grid-row: 1;
    order: -1;
  }
  .card-tl, .card-tr, .card-bl, .card-br {
    grid-column: auto;
    grid-row: auto;
  }
}

@media (max-width: 640px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
}
</style>
