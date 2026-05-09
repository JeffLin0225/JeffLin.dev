<template>
  <section id="contact-section" class="py-20 border-t border-border-subtle">
    <div class="container-main text-center">
      <div class="flex items-center justify-center gap-4 mb-8">
        <span class="hidden md:block flex-1 max-w-[120px] h-px bg-border-subtle" />
        <h2 class="font-display text-xl font-semibold tracking-tight">聯繫我</h2>
        <span class="hidden md:block flex-1 max-w-[120px] h-px bg-border-subtle" />
      </div>

      <p class="text-text-muted text-sm mb-10">歡迎透過以下方式與我聯繫</p>

      <div class="flex items-center justify-center gap-6">
        <a id="contact-github" href="https://github.com/Jefflin0225" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 px-6 py-3.5 border border-border-default rounded-card bg-transparent transition-[border-color,background,transform] duration-normal hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]">
          <svg class="w-5 h-5 text-text-secondary transition-colors duration-fast group-hover:text-text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span class="font-display text-sm font-medium text-text-secondary transition-colors duration-fast group-hover:text-text-primary">GitHub</span>
          <span class="font-mono text-xs text-text-muted/40 transition-[transform,color] duration-fast group-hover:translate-x-0.5 group-hover:text-text-muted">↗</span>
        </a>

        <a id="contact-email" href="mailto:jeff@example.com" class="group flex items-center gap-3 px-6 py-3.5 border border-border-default rounded-card bg-transparent transition-[border-color,background,transform] duration-normal hover:border-border-accent hover:bg-accent-glow active:scale-[0.97]">
          <svg class="w-5 h-5 text-text-secondary transition-colors duration-fast group-hover:text-text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M22 4L12 13L2 4"/>
          </svg>
          <span class="font-display text-sm font-medium text-text-secondary transition-colors duration-fast group-hover:text-text-primary">Email</span>
          <span class="font-mono text-xs text-text-muted/40 transition-[transform,color] duration-fast group-hover:translate-x-0.5 group-hover:text-text-muted">↗</span>
        </a>
      </div>

      <div class="mt-10 flex items-center justify-center">
        <span class="inline-flex items-center gap-2 px-3 py-1 border border-status-success/30 rounded-pill text-xs font-display font-medium text-status-success bg-status-success/[0.08]">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          開放合作中
        </span>
      </div>
    </div>
  </section>
</template>
