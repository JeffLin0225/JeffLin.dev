<template>
  <div class="min-h-screen bg-surface-primary">
    <!-- 全站導航進度條（頂部細線，類似 GitHub / YouTube） -->
    <NuxtLoadingIndicator :height="2" color="hsla(0, 0%, 100%, 0.6)" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
/* ─── 全站分享預覽（LINE / FB / LinkedIn / X）───
 * 各頁的 useSeoMeta 只需覆寫 title / description，圖片沿用這裡。
 * og:image 必須是絕對網址，爬蟲不會幫你補 domain。
 */
const route = useRoute()
const SITE_URL = 'https://jxlin.dev'

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'JXlin.dev',
  ogLocale: 'zh_TW',
  ogUrl: () => `${SITE_URL}${route.path}`,
  ogImage: `${SITE_URL}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Jia-Xian Lin 林家賢 — Full-Stack Developer',
  twitterCard: 'summary_large_image',
  twitterImage: `${SITE_URL}/og.png`,
})
</script>
