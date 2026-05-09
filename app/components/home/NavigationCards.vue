<template>
  <section id="navigation-cards" class="py-20">
    <div class="container-main">
      <!-- Section header with ASCII decoration -->
      <div class="flex items-center gap-4 mb-12">
        <span class="font-mono text-xs text-text-muted/40">001</span>
        <h2 class="font-display text-2xl font-bold tracking-tight">
          Explore
        </h2>
        <div class="flex-1 h-px bg-border-subtle" />
        <span class="font-mono text-xs text-text-muted/40">───</span>
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink
          v-for="(card, index) in cards"
          :key="card.path"
          :to="card.path"
          class="nav-card group relative bg-surface-secondary border border-border-subtle rounded-card p-6 cursor-pointer overflow-hidden transition-[border-color,transform,box-shadow] duration-300 ease-smooth hover:border-border-strong hover:-translate-y-0.5 hover:shadow-glow-lg"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          <!-- Top gradient line (card hover reveal) -->
          <div
            class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <!-- Terminal-style header bar -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
              <span class="w-2 h-2 rounded-full bg-text-muted/20" />
            </div>
            <span class="font-mono text-xs text-text-muted/60 ml-1">{{ card.filename }}</span>
          </div>

          <!-- Code-style content -->
          <div class="font-mono text-sm mb-4">
            <!-- Line 1: Comment -->
            <div class="flex items-start gap-3 mb-1">
              <span class="text-text-muted/30 text-xs w-6 text-right shrink-0">1</span>
              <span class="text-text-muted/60">// {{ card.comment }}</span>
            </div>
            <!-- Line 2: Export -->
            <div class="flex items-start gap-3 mb-1">
              <span class="text-text-muted/30 text-xs w-6 text-right shrink-0">2</span>
              <div>
                <span class="text-text-muted">export</span>
                <span class="text-text-secondary ml-1">const</span>
                <span class="text-text-primary ml-1 font-medium">{{ card.varName }}</span>
                <span class="text-text-muted ml-1">=</span>
                <span class="text-text-muted ml-1">{</span>
              </div>
            </div>
            <!-- Line 3: Title -->
            <div class="flex items-start gap-3 mb-1">
              <span class="text-text-muted/30 text-xs w-6 text-right shrink-0">3</span>
              <div class="ml-4">
                <span class="text-text-secondary">title</span>
                <span class="text-text-muted">:</span>
                <span class="text-text-primary ml-1">'{{ card.title }}'</span>
                <span class="text-text-muted">,</span>
              </div>
            </div>
            <!-- Line 4: empty/close -->
            <div class="flex items-start gap-3">
              <span class="text-text-muted/30 text-xs w-6 text-right shrink-0">4</span>
              <span class="text-text-muted">}</span>
            </div>
          </div>

          <!-- Description (outside code block) -->
          <p class="text-text-secondary text-sm leading-relaxed mb-4 font-sans">
            {{ card.description }}
          </p>

          <!-- Footer: tags + arrow -->
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <span
                v-for="tag in card.tags"
                :key="tag"
                class="px-2.5 py-0.5 text-xs font-mono text-text-muted border border-border-subtle rounded-pill transition-[border-color,color] duration-fast group-hover:border-border-default group-hover:text-text-secondary"
              >
                {{ tag }}
              </span>
            </div>
            <span class="text-text-muted text-sm transition-[transform,color] duration-fast group-hover:text-text-primary group-hover:translate-x-1">
              →
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface NavCard {
  path: string
  filename: string
  comment: string
  varName: string
  title: string
  description: string
  tags: string[]
}

const cards: NavCard[] = [
  {
    path: '/github',
    filename: 'github.ts',
    comment: 'Open source projects & repos',
    varName: 'github',
    title: 'GitHub Projects',
    description: 'Browse and search my GitHub repositories. Fuzzy search, language filtering, and real-time data synced from GitHub API.',
    tags: ['repos', 'search', 'open-source'],
  },
  {
    path: '/about',
    filename: 'about.ts',
    comment: 'Who I am & what I do',
    varName: 'about',
    title: 'About Me',
    description: 'Learn about my background, skills, and the technologies I work with. From frontend to backend, cloud to DevOps.',
    tags: ['skills', 'experience', 'stack'],
  },
  {
    path: '/contact',
    filename: 'contact.ts',
    comment: 'Get in touch',
    varName: 'contact',
    title: 'Contact',
    description: 'Want to collaborate or just say hi? Reach out through GitHub or email. Always open to interesting conversations.',
    tags: ['email', 'github', 'connect'],
  },
  {
    path: '/github',
    filename: 'featured.ts',
    comment: 'Highlighted work',
    varName: 'featured',
    title: 'Featured Work',
    description: 'Selected projects that showcase my best work — from full-stack applications to developer tools and open-source contributions.',
    tags: ['portfolio', 'highlights', 'showcase'],
  },
]
</script>

<style scoped>
.nav-card {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
