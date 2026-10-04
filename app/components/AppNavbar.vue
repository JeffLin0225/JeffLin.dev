<template>
  <nav
    id="main-navbar"
    class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
  >
    <!-- Glowing bright white divider line -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
    <div class="container-main flex items-center justify-between h-16 relative">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-0.5" aria-label="Home">
        <span class="font-display text-xl font-bold tracking-tight text-text-primary">
          JXlin
        </span>
        <span class="font-display text-xl font-normal text-text-muted transition-colors duration-normal group-hover:text-text-secondary">
          .dev
        </span>
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <ul class="hidden md:flex items-center gap-8 list-none">
        <template v-for="link in navLinks" :key="link.path">
          <!-- 分隔線：切開功能頁（Home / GitHub / CraditCard）與非功能頁（About / 流量 / 架構圖）-->
          <li v-if="link.dividerBefore" aria-hidden="true" role="presentation">
            <span class="block w-px h-4 bg-border-strong" />
          </li>
          <li>
            <a
              v-if="link.external"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link font-display text-sm font-medium tracking-wide transition-colors duration-normal text-text-primary/70 hover:text-text-primary"
            >
              <span class="font-mono text-xs mr-1 transition-colors duration-normal text-text-primary/40">{{ link.prefix }}</span>
              {{ link.label }}
              <span class="text-text-primary/40" aria-hidden="true">↗</span>
            </a>
            <NuxtLink
              v-else
              :to="link.path"
              class="nav-link font-display text-sm font-medium tracking-wide transition-colors duration-normal"
              :class="[
                isActive(link.path)
                  ? 'nav-link--active text-text-primary'
                  : 'text-text-primary/70 hover:text-text-primary'
              ]"
            >
              <span
                class="font-mono text-xs mr-1 transition-colors duration-normal"
                :class="isActive(link.path) ? 'text-text-primary/90' : 'text-text-primary/40'"
              >{{ link.prefix }}</span>
              {{ link.label }}
            </NuxtLink>
          </li>
        </template>
      </ul>

      <!-- Mobile Menu Toggle -->
      <button
        id="mobile-menu-toggle"
        class="md:hidden flex flex-col gap-1.5 p-2 border border-border-default rounded-sm transition-border-color duration-fast hover:border-border-accent"
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="block w-5 h-px bg-text-primary transition-transform duration-normal"
          :class="{ 'rotate-45 translate-y-[4px]': mobileOpen }"
        />
        <span
          class="block w-5 h-px bg-text-primary transition-opacity duration-fast"
          :class="{ 'opacity-0': mobileOpen }"
        />
        <span
          class="block w-5 h-px bg-text-primary transition-transform duration-normal"
          :class="{ '-rotate-45 -translate-y-[4px]': mobileOpen }"
        />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-border-subtle glass"
      >
        <ul class="container-main py-4 flex flex-col gap-1 list-none">
          <template v-for="link in navLinks" :key="link.path">
            <!-- 分隔線：切開功能頁（Home / GitHub / CraditCard）與非功能頁（About / 流量 / 架構圖）-->
            <li v-if="link.dividerBefore" aria-hidden="true" role="presentation" class="my-2 border-t border-border-subtle" />
            <li>
              <a
                v-if="link.external"
                :href="link.path"
                target="_blank"
                rel="noopener noreferrer"
                class="block py-3 px-4 font-display text-sm font-medium rounded-sm transition-colors duration-fast hover:text-text-primary hover:bg-surface-hover text-text-primary/60"
                @click="mobileOpen = false"
              >
                <span class="font-mono text-xs mr-2 text-text-muted">{{ link.prefix }}</span>
                {{ link.label }}
                <span class="text-text-muted" aria-hidden="true">↗</span>
              </a>
              <NuxtLink
                v-else
                :to="link.path"
                class="block py-3 px-4 font-display text-sm font-medium rounded-sm transition-colors duration-fast hover:text-text-primary hover:bg-surface-hover"
                :class="[
                  isActive(link.path)
                    ? 'text-text-primary bg-white/[0.04] border-l-2 border-white/40'
                    : 'text-text-primary/60'
                ]"
                @click="mobileOpen = false"
              >
                <span
                  class="font-mono text-xs mr-2"
                  :class="isActive(link.path) ? 'text-text-primary/80' : 'text-text-muted'"
                >{{ link.prefix }}</span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </nav>

  <!-- Spacer for fixed navbar -->
  <div class="h-16" />
</template>

<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

interface NavLink {
  label: string
  path: string
  prefix: string
  /** 外部連結：render 成 <a target="_blank">，不走 NuxtLink / isActive */
  external?: boolean
  /** 在這個項目前插入視覺分隔線，用來切開功能頁與非功能頁 */
  dividerBefore?: boolean
}

const navLinks: NavLink[] = [
  { label: 'Home', path: '/', prefix: '~/' },
  { label: 'GitHub-Searcher', path: '/github', prefix: './' },
  { label: 'CraditCard-Searcher', path: '/craditCard', prefix: './' },
  { label: 'About', path: '/about', prefix: './', dividerBefore: true },
  { label: '流量', path: '/stats', prefix: './' },
  {
    label: '互動架構圖',
    path: 'https://public.jxlin.dev/video/architecture.html',
    prefix: './',
    external: true,
  },
]

const isActive = (path: string): boolean => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

/* Close mobile menu on route change */
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
/* ─── Nav link underline animation ─── */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-white);
  transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-link:hover::after {
  width: 100%;
}

/* ─── Active page: persistent underline with soft glow ─── */
.nav-link--active::after {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, hsla(0, 0%, 100%, 0.6) 30%, hsla(0, 0%, 100%, 0.9) 50%, hsla(0, 0%, 100%, 0.6) 70%, transparent 100%);
  box-shadow: 0 1px 6px hsla(0, 0%, 100%, 0.15);
}
.nav-link--active:hover::after {
  width: 100%;
}

/* ─── Mobile menu transition ─── */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}
</style>
