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
