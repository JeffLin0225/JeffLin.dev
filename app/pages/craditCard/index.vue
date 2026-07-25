<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-28 pb-8 md:pt-36 md:pb-10">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute inset-0 bg-radial-fade" />
      </div>

      <div class="relative z-10 container-main px-4 text-center">
        <div class="animate-fade-up stagger-1">
          <span class="inline-block px-3 py-1 mb-5 text-xs font-mono text-text-muted border border-border-subtle rounded-pill">
            CraditCard-Searcher
          </span>
        </div>

        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-3 animate-fade-up stagger-2">
          <span class="mr-2">💳</span>刷哪張？
        </h1>

        <p class="font-mono text-base md:text-lg text-text-secondary mb-4 animate-fade-up stagger-3">
          信用卡回饋速查工具
        </p>

        <p class="text-text-muted text-sm md:text-base font-light max-w-lg mx-auto mb-8 leading-relaxed animate-fade-up stagger-4">
          出門消費不再選擇困難。一鍵搜尋店家或通路，<br class="hidden md:block" />
          瞬間找到當下回饋最高的信用卡刷法。
        </p>

        <div class="flex items-center justify-center gap-4 animate-fade-up stagger-5">
          <a
            :href="config.public.craditCardUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="cta-btn px-8 py-3 bg-white text-surface-primary font-display text-sm font-semibold rounded-sm transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] active:scale-[0.97]"
          >
            <span class="font-mono text-text-muted text-xs mr-1.5">↗</span>前往使用
          </a>
          <NuxtLink
            to="/"
            class="px-6 py-3 border border-border-default text-text-secondary font-display text-sm font-medium rounded-sm transition-all duration-300 hover:border-border-accent hover:text-text-primary"
          >
            ← 返回首頁
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-8 md:py-10">
      <div class="container-main px-4">
        <div class="flex items-center gap-4 mb-6">
          <span class="font-mono text-xs text-text-muted/40">001</span>
          <h2 class="font-display text-2xl font-bold tracking-tight">核心功能</h2>
          <div class="flex-1 h-px bg-border-subtle" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="feature-card group"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="feature-card-inner">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ feature.icon }}</span>
                <h3 class="font-display text-sm font-semibold text-text-primary">{{ feature.title }}</h3>
              </div>
              <p class="text-text-secondary text-xs leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cards Showcase -->
    <section class="py-8 md:py-10">
      <div class="container-main px-4">
        <div class="flex items-center gap-4 mb-6">
          <span class="font-mono text-xs text-text-muted/40">002</span>
          <h2 class="font-display text-2xl font-bold tracking-tight">已收錄信用卡</h2>
          <div class="flex-1 h-px bg-border-subtle" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(card, i) in creditCards"
            :key="card.name"
            class="credit-card-item"
            :style="{ animationDelay: `${i * 120}ms` }"
          >
            <div class="credit-card-inner">
              <!-- Card Header with simulated card chip -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="card-chip" />
                  <span class="font-display text-sm font-bold text-text-primary">{{ card.name }}</span>
                </div>
                <span class="px-2 py-0.5 text-xs font-mono font-bold rounded-sm" :class="card.badgeClass">
                  {{ card.maxReward }}
                </span>
              </div>
              <p class="text-text-secondary text-xs leading-relaxed mb-3">{{ card.highlight }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in card.tags"
                  :key="tag"
                  class="px-2 py-0.5 text-[10px] font-mono text-text-muted border border-border-subtle rounded-pill"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="py-8 md:py-10">
      <div class="container-main px-4">
        <div class="flex items-center gap-4 mb-6">
          <span class="font-mono text-xs text-text-muted/40">003</span>
          <h2 class="font-display text-2xl font-bold tracking-tight">技術架構</h2>
          <div class="flex-1 h-px bg-border-subtle" />
        </div>

        <div class="tech-panel">
          <div class="flex items-center gap-2 mb-4">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
            </div>
            <span class="font-mono text-xs text-text-muted/60 ml-1">stack.json</span>
          </div>

          <div class="font-mono text-xs leading-loose text-text-secondary">
            <div class="text-text-muted/40">// Zero dependencies, pure vanilla</div>
            <div>
              <span class="text-text-muted/50">{</span>
            </div>
            <div class="pl-4">
              <span class="text-amber-400/80">"structure"</span><span class="text-text-muted/50">:</span>
              <span class="text-green-400/80"> "HTML5"</span><span class="text-text-muted/50">,</span>
            </div>
            <div class="pl-4">
              <span class="text-amber-400/80">"styling"</span><span class="text-text-muted/50">:</span>
              <span class="text-green-400/80"> "CSS3 (Custom Properties, Grid, Keyframes)"</span><span class="text-text-muted/50">,</span>
            </div>
            <div class="pl-4">
              <span class="text-amber-400/80">"logic"</span><span class="text-text-muted/50">:</span>
              <span class="text-green-400/80"> "Vanilla JavaScript (ES6+)"</span><span class="text-text-muted/50">,</span>
            </div>
            <div class="pl-4">
              <span class="text-amber-400/80">"persistence"</span><span class="text-text-muted/50">:</span>
              <span class="text-green-400/80"> "localStorage"</span><span class="text-text-muted/50">,</span>
            </div>
            <div class="pl-4">
              <span class="text-amber-400/80">"deploy"</span><span class="text-text-muted/50">:</span>
              <span class="text-green-400/80"> "Cloudflare Pages"</span>
            </div>
            <div>
              <span class="text-text-muted/50">}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-10 md:py-14">
      <div class="container-main px-4 text-center">
        <p class="font-mono text-sm text-text-muted mb-5">Ready to find the best card?</p>
        <a
          :href="config.public.craditCardUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-btn inline-flex items-center gap-2 px-10 py-3.5 bg-white text-surface-primary font-display text-sm font-semibold rounded-sm transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] active:scale-[0.97]"
        >
          💳 前往「刷哪張？」
          <span class="font-mono text-xs text-text-muted">↗</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/* ─── Config ─── */
const config = useRuntimeConfig()

/* ─── SEO ─── */
useSeoMeta({
  title: 'CraditCard-Searcher — 刷哪張？信用卡回饋速查 | Jeff Lin',
  description: '一鍵搜尋店家、通路或卡片名稱，瞬間找到回饋最高的信用卡刷法。收錄國泰CUBE、玉山Unicard、富邦J卡、玉山熊本熊卡等熱門信用卡。',
  ogTitle: 'CraditCard-Searcher — 刷哪張？信用卡回饋速查',
  ogDescription: '出門消費不再選擇困難。快速查詢最佳刷卡回饋方案。',
})

/* ─── Features Data ─── */
const features = [
  {
    icon: '🔍',
    title: '關鍵字即時搜尋',
    desc: '輸入店家名稱、支付通路或卡片名稱，即時過濾出最相關的回饋規則，毫秒級回應。',
  },
  {
    icon: '🎯',
    title: '多維度條件篩選',
    desc: '依信用卡種類與支付通路進行精準下拉篩選，快速縮小範圍。',
  },
  {
    icon: '📊',
    title: '回饋趴數智慧排序',
    desc: '搜尋結果自動按回饋百分比由高至低排列，最高回饋一目了然。',
  },
  {
    icon: '🔄',
    title: '權益切換提醒',
    desc: '醒目標示是否需要切換權益，例如 CUBE 切至「台塑家」或 Unicard 訂閱「UP選」。',
  },
  {
    icon: '📥',
    title: '資料匯入匯出',
    desc: '一鍵將回饋規則備份為 JSON 檔案，或匯入自訂私房刷卡攻略。',
  },
  {
    icon: '💾',
    title: '免註冊即開即用',
    desc: '使用瀏覽器 localStorage 儲存資料，首次開啟自動載入精選預設，完全離線可用。',
  },
]

/* ─── Credit Cards Data ─── */
const creditCards = [
  {
    name: '國泰世華 CUBE 卡',
    maxReward: '最高 3.3%',
    highlight: '切換各大權益（玩數位、樂饗購、趣旅行、集精明、慶生月、台塑家、全支付）享多元通路高回饋。',
    tags: ['LINE Pay', 'Apple Pay', '超商', '串流', '外送'],
    badgeClass: 'bg-blue-500/20 text-blue-400',
  },
  {
    name: '玉山 Unicard',
    maxReward: '最高 4.5%',
    highlight: '簡單選 3.0% / 任意選 3.5% / UP選 4.5%，百大特店與行動支付無腦刷首選。',
    tags: ['行動支付', '百貨', '電商', '餐飲', '交通'],
    badgeClass: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    name: '富邦 J 卡',
    maxReward: '最高 10%',
    highlight: '日本交通卡 Apple Pay 儲值 10%、日韓泰與亞洲實體消費 6%，出國神卡。',
    tags: ['Suica', 'PASMO', '日本', '韓國', '泰國'],
    badgeClass: 'bg-purple-500/20 text-purple-400',
  },
  {
    name: '玉山熊本熊卡',
    maxReward: '最高 8.5%',
    highlight: '日本指定交通、住宿、樂園、美食、藥妝家電最高 8.5% 專屬回饋。',
    tags: ['日本限定', '交通', '迪士尼', '藥妝', '家電'],
    badgeClass: 'bg-red-500/20 text-red-400',
  },
]
</script>

<style scoped>
.bg-radial-fade {
  background: radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, var(--bg-primary) 100%);
}

/* ─── Staggered Animations ─── */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 200ms; }
.stagger-4 { animation-delay: 300ms; }
.stagger-5 { animation-delay: 400ms; }

/* ─── Feature Cards ─── */
.feature-card {
  animation: featureFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.feature-card-inner {
  height: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: border-color 300ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
}
.feature-card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  transition: opacity 300ms ease;
}
.feature-card:hover .feature-card-inner {
  border-color: var(--border-strong);
  transform: translateY(-3px);
  box-shadow: 0 8px 32px hsla(0, 0%, 0%, 0.4);
}
.feature-card:hover .feature-card-inner::before {
  opacity: 1;
}

/* ─── Credit Card Items ─── */
.credit-card-item {
  animation: featureFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.credit-card-inner {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: border-color 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms ease;
}
.credit-card-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at 80% 0%, rgba(255, 255, 255, 0.03), transparent 60%);
  opacity: 0;
  transition: opacity 500ms ease;
  pointer-events: none;
}
.credit-card-item:hover .credit-card-inner {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px hsla(0, 0%, 0%, 0.4);
}
.credit-card-item:hover .credit-card-inner::after {
  opacity: 1;
}

/* Card Chip */
.card-chip {
  width: 28px;
  height: 20px;
  border-radius: 3px;
  background: linear-gradient(135deg, hsla(45, 70%, 55%, 0.6), hsla(45, 70%, 35%, 0.4));
  border: 1px solid hsla(45, 50%, 50%, 0.3);
  position: relative;
}
.card-chip::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 1px solid hsla(45, 50%, 50%, 0.3);
  border-radius: 1px;
}

/* ─── Tech Panel ─── */
.tech-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 36rem;
}

/* ─── CTA Button Glow ─── */
.cta-btn {
  position: relative;
}
.cta-btn::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, hsla(0, 0%, 100%, 0.15), transparent 50%, hsla(0, 0%, 100%, 0.08));
  z-index: -1;
  opacity: 0;
  transition: opacity 300ms ease;
}
.cta-btn:hover::after {
  opacity: 1;
}

@keyframes featureFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
