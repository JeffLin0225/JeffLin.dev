<template>
  <section id="hero-section" class="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-28">
    <!-- Grid background -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0 bg-radial-fade" />
    </div>

    <!-- Layout: 4 cards surrounding the central bio -->
    <div class="relative z-10 w-full container-main px-4">
      <div class="hero-grid">

        <!-- Top-Left Card -->
        <NuxtLink to="/github" class="nav-card group card-tl">
          <div class="card-inner">
            <PuzzleCardHeader filename="github.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">GitHub 專案</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">瀏覽與搜尋我的 Repositories。</p>
            <PuzzleCardFooter :tags="['repos', 'search']" />
          </div>
        </NuxtLink>

        <!-- Top-Right Card -->
        <NuxtLink to="/about" class="nav-card group card-tr">
          <div class="card-inner">
            <PuzzleCardHeader filename="skills.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">關於我</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">了解我的背景與技術棧。</p>
            <PuzzleCardFooter :tags="['skills', 'stack']" />
          </div>
        </NuxtLink>

        <!-- Center Piece: Self Introduction -->
        <div class="hero-center flex flex-col items-center justify-center">
          <h1 class="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-8 animate-fade-up stagger-1">
            Hi, I'm
            <span class="relative inline-block group cursor-default whitespace-nowrap">
              <span class="bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary transition-all duration-700 font-mono">{{ scrambledName }}</span>
              <span class="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-border-accent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
            </span>
          </h1>
          <div class="font-mono text-base md:text-lg text-text-secondary mb-10 animate-fade-up stagger-2 h-7 flex items-center justify-center">
            <span class="text-text-muted/60 mr-2">&gt;</span>
            <span class="relative inline-block pb-0.5">
              {{ displayedText }}
              <span class="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent to-border-accent opacity-80" />
            </span>
            <span class="inline-block w-[2px] h-5 bg-text-primary ml-1 animate-blink" />
          </div>
          <p class="text-text-muted text-sm md:text-base font-light max-w-md mx-auto mb-12 leading-relaxed animate-fade-up stagger-3">
            用現代網路技術打造數位體驗。
            <br class="hidden md:block" />
            乾淨的程式碼、深思熟慮的設計、流暢的效能。
          </p>
          <div class="flex items-center justify-center gap-4 animate-fade-up stagger-4">
            <!-- <NuxtLink
              to="/github"
              class="px-6 py-2.5 bg-white text-surface-primary font-display text-sm font-medium rounded-sm transition-[background,transform] duration-fast hover:bg-neutral-200 active:scale-[0.97]"
            >
              探索專案
            </NuxtLink> -->
            <a
              href="https://github.com/Jefflin0225"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-2.5 bg-white text-surface-primary font-display text-sm font-medium rounded-sm transition-[background,transform] duration-fast hover:bg-neutral-200 active:scale-[0.97]"
            >
              <span class="font-mono text-text-muted text-xs mr-1.5">↗</span>GitHub
            </a>
          </div>
        </div>

        <!-- Bottom-Left Card -->
        <NuxtLink to="/contact" class="nav-card group card-bl">
          <div class="card-inner">
            <PuzzleCardHeader filename="contact.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">聯繫方式</h3>
            <p class="text-text-secondary text-xs leading-relaxed mb-2">透過 GitHub 或 Email 聯繫我。</p>
            <PuzzleCardFooter :tags="['email', 'github']" />
          </div>
        </NuxtLink>

        <!-- Bottom-Right Card -->
        <NuxtLink to="/github" class="nav-card group card-br">
          <div class="card-inner">
            <PuzzleCardHeader filename="featured.ts" />
            <h3 class="font-display text-sm font-semibold text-text-primary mb-1 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">精選作品</h3>
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
const originalName = 'Jeff Lin'
const scrambledName = ref(originalName)
let scrambleInterval: ReturnType<typeof setInterval> | null = null
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>'

const startScramble = () => {
  let iteration = 0
  if (scrambleInterval) clearInterval(scrambleInterval)
  
  scrambleInterval = setInterval(() => {
    scrambledName.value = originalName.split('').map((letter, index) => {
      if(index < iteration) {
        return originalName[index]
      }
      return letters[Math.floor(Math.random() * letters.length)]
    }).join('')
    
    if(iteration >= originalName.length) {
      if (scrambleInterval) clearInterval(scrambleInterval)
    }
    iteration += 1 / 3
  }, 45)
}
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
onMounted(() => { 
  startScramble()
  timeoutId = setTimeout(tick, 800) 
})
onUnmounted(() => { 
  if (timeoutId) clearTimeout(timeoutId) 
  if (scrambleInterval) clearInterval(scrambleInterval)
})
</script>

<style scoped>

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
  padding: 0.25rem 1rem;
}

/* ─── Card Base (Premium Hacker UI/UX) ─── */
.nav-card {
  display: flex;
  text-decoration: none;
  height: 100%;
  position: relative;
}

/* Decorative Crosshairs on corners */
.nav-card::before, .nav-card::after {
  content: '+';
  position: absolute;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 400ms ease, transform 400ms ease;
  pointer-events: none;
  z-index: 20;
}
.nav-card::before { top: -8px; left: -5px; }
.nav-card::after { bottom: -8px; right: -5px; }

.nav-card:hover::before { opacity: 0.8; transform: rotate(90deg); }
.nav-card:hover::after { opacity: 0.8; transform: rotate(-90deg); }

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
  /* 超厚 3D Effect by Default */
  box-shadow: 
    0 8px 0 0 #050505,
    0 8px 0 1px rgba(255, 255, 255, 0.05),
    0 20px 40px rgba(0, 0, 0, 1),
    inset 0 1px 1px rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  transition:
    border-color 400ms ease,
    transform 400ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 400ms ease;
}

/* Background spotlight glow on hover */
.card-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%);
  opacity: 0;
  transition: opacity 500ms ease;
  pointer-events: none;
}

/* Animated Shimmering Top Border */
.card-inner::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 200%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  transition: opacity 400ms ease;
  z-index: 10;
}

/* Hover effects */
.nav-card:hover .card-inner {
  border-color: var(--border-accent);
  transform: translateY(-12px);
  box-shadow: 
    0 12px 0 0 #050505,
    0 12px 0 1px rgba(255, 255, 255, 0.08),
    0 30px 50px rgba(0, 0, 0, 1),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}
.nav-card:hover .card-inner::after {
  opacity: 1; /* Fade in spotlight */
}
.nav-card:hover .card-inner::before {
  opacity: 1;
  animation: shimmerLine 2.5s infinite linear;
}

@keyframes shimmerLine {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}

/* ─── Animations ─── */
.nav-card, .hero-center {
  animation: fadeUpIn 2.0s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-center { animation-delay: 0s; }
.card-tl { animation-delay: 0.3s; }
.card-tr { animation-delay: 0.6s; }
.card-bl { animation-delay: 0.9s; }
.card-br { animation-delay: 1.2s; }

@keyframes fadeUpIn {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
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
