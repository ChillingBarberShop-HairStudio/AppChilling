<script setup lang="ts">
defineProps<{
  title?: string
  noPadding?: boolean
}>()
</script>

<template>
  <div class="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col transition-all duration-200">
    <div v-if="title || $slots.header" class="px-5 py-4 border-b border-border flex justify-between items-center bg-gray-50/50">
      <h3 v-if="title" class="font-semibold text-barber-navy">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div class="flex-1" :class="{ 'p-5': !noPadding }">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 border-t border-border bg-gray-50/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
