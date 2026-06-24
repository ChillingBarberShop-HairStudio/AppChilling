<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'hero'
  useFallback?: boolean
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-1 w-full rounded-full'
    case 'md': return 'h-2 w-full rounded-full'
    case 'lg': return 'h-4 w-full rounded-full'
    case 'hero': return 'h-full w-full'
    default: return 'h-2 w-full rounded-full'
  }
})
</script>

<template>
  <div class="overflow-hidden bg-barber-navy" :class="sizeClasses">
    <div v-if="!useFallback" class="barber-pole-texture h-full w-full"></div>
    <div v-else class="barber-pole-fallback h-full w-full"></div>
  </div>
</template>
