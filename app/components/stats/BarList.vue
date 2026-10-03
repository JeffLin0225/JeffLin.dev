<template>
  <div class="p-6 rounded-card border border-border-subtle bg-surface-secondary">
    <h2 class="font-display text-base font-semibold mb-5">{{ title }}</h2>

    <p v-if="rows.length === 0" class="text-sm text-text-muted">
      {{ emptyText }}
    </p>

    <ul v-else class="list-none space-y-3">
      <li v-for="row in rows" :key="row.key">
        <div class="flex items-baseline justify-between gap-3 mb-1.5">
          <span class="font-mono text-xs text-text-secondary truncate">
            {{ row.label }}
          </span>
          <span class="font-mono text-xs text-text-primary tabular-nums shrink-0">
            {{ row.value.toLocaleString('en-US') }}
          </span>
        </div>
        <div class="h-1 rounded-pill bg-white/[0.06] overflow-hidden">
          <div
            class="h-full rounded-pill bg-white/30"
            :style="{ width: `${(row.value / max) * 100}%` }"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface BarRow {
  key: string
  label: string
  value: number
}

const props = defineProps<{
  title: string
  rows: BarRow[]
  emptyText?: string
}>()

const max = computed(() => Math.max(1, ...props.rows.map(r => r.value)))
</script>
