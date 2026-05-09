<template>
  <section id="navigation-cards" class="py-20">
    <div class="container-main">
      <div class="flex items-center gap-4 mb-12">
        <span class="font-mono text-xs text-text-muted/40">001</span>
        <h2 class="font-display text-2xl font-bold tracking-tight">探索更多</h2>
        <div class="flex-1 h-px bg-border-subtle" />
      </div>

      <div class="puzzle-grid">
        <NuxtLink to="/github" class="puzzle-card group top-left">
          <div class="card-inner">
            <PuzzleCardHeader filename="github.ts" />
            <h3 class="font-display text-lg font-semibold text-text-primary mb-2">GitHub 專案</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-4">瀏覽與搜尋我的 GitHub Repositories，支援模糊搜尋與語言篩選。</p>
            <PuzzleCardFooter :tags="['repos', 'search']" />
          </div>
        </NuxtLink>

        <div class="puzzle-center">
          <div class="center-inner">
            <div class="flex items-center gap-2 mb-5">
              <div class="flex gap-1.5">
                <span class="w-2 h-2 rounded-full bg-text-muted/20" />
                <span class="w-2 h-2 rounded-full bg-text-muted/20" />
                <span class="w-2 h-2 rounded-full bg-text-muted/20" />
              </div>
              <span class="font-mono text-xs text-text-muted/60">about.md</span>
            </div>
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-full border border-border-default bg-surface-elevated flex items-center justify-center font-display text-xl font-bold text-text-secondary">JL</div>
              <div>
                <h3 class="font-display text-lg font-bold text-text-primary">Jeff Lin</h3>
                <p class="font-mono text-xs text-text-muted">Full-Stack Developer</p>
              </div>
            </div>
            <p class="text-text-secondary text-sm leading-relaxed mb-5">熱衷於打造高品質的網頁應用程式，專注於使用者體驗與程式碼品質。從前端到後端，從雲端到 DevOps，持續學習與精進。</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in techStack" :key="tech" class="px-2.5 py-1 text-xs font-mono text-text-muted border border-border-subtle rounded-pill">{{ tech }}</span>
            </div>
          </div>
        </div>

        <NuxtLink to="/about" class="puzzle-card group top-right">
          <div class="card-inner">
            <PuzzleCardHeader filename="skills.ts" />
            <h3 class="font-display text-lg font-semibold text-text-primary mb-2">關於我</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-4">了解我的背景與技術棧，從前端到後端、雲端到 DevOps。</p>
            <PuzzleCardFooter :tags="['skills', 'experience']" />
          </div>
        </NuxtLink>

        <NuxtLink to="/contact" class="puzzle-card group bottom-left">
          <div class="card-inner">
            <PuzzleCardHeader filename="contact.ts" />
            <h3 class="font-display text-lg font-semibold text-text-primary mb-2">聯繫方式</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-4">想要合作或打個招呼？歡迎透過 GitHub 或 Email 聯繫我。</p>
            <PuzzleCardFooter :tags="['email', 'github']" />
          </div>
        </NuxtLink>

        <NuxtLink to="/github" class="puzzle-card group bottom-right">
          <div class="card-inner">
            <PuzzleCardHeader filename="featured.ts" />
            <h3 class="font-display text-lg font-semibold text-text-primary mb-2">精選作品</h3>
            <p class="text-text-secondary text-sm leading-relaxed mb-4">精選最有代表性的作品 — 全端應用與開源貢獻。</p>
            <PuzzleCardFooter :tags="['portfolio', 'highlights']" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const techStack = ['Vue', 'Nuxt', 'TypeScript', 'Node.js', 'Cloudflare', 'Tailwind']
</script>

<style scoped>
.puzzle-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr;
  grid-template-rows: auto auto;
  gap: 0;
}
.puzzle-center {
  grid-row: 1 / 3;
  grid-column: 2;
  z-index: 10;
  padding: 6px;
}
.center-inner {
  height: 100%;
  background: var(--bg-secondary);
  border: 1.5px solid var(--border-default);
  border-radius: 0.75rem;
  padding: 1.75rem;
  position: relative;
}
.center-inner::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, hsla(0,0%,100%,0.06), transparent 50%, hsla(0,0%,100%,0.03));
  z-index: -1;
  pointer-events: none;
}
.puzzle-card {
  display: block;
  padding: 6px;
  text-decoration: none;
}
.card-inner {
  height: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 300ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1), box-shadow 300ms ease;
}
.card-inner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}
.puzzle-card:hover .card-inner {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px hsla(0,0%,0%,0.4);
}
.puzzle-card:hover .card-inner::before { opacity: 1; }

/* Puzzle notches */
.top-left .card-inner::after,
.bottom-left .card-inner::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 20px;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-subtle);
  border-radius: 0 10px 10px 0;
}
.top-right .card-inner::after,
.bottom-right .card-inner::after {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 20px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-subtle);
  border-radius: 10px 0 0 10px;
}
.bottom-left .card-inner::after { top: 40%; }
.bottom-right .card-inner::after { top: 40%; }

/* Entry animation */
.puzzle-card, .puzzle-center {
  animation: puzzleFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
.top-left { animation-delay: 0ms; }
.puzzle-center { animation-delay: 100ms; }
.top-right { animation-delay: 200ms; }
.bottom-left { animation-delay: 300ms; }
.bottom-right { animation-delay: 400ms; }
@keyframes puzzleFadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 768px) {
  .puzzle-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .puzzle-center { grid-row: auto; grid-column: auto; order: -1; }
  .top-left .card-inner::after,
  .top-right .card-inner::after,
  .bottom-left .card-inner::after,
  .bottom-right .card-inner::after { display: none; }
}
</style>
