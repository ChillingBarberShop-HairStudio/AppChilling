<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: any
}>()

const formatValue = (val: string | number) => {
  if (typeof val === 'number') {
    return new Intl.NumberFormat('vi-VN').format(val)
  }
  return val
}

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-success bg-success/10'
  if (props.trend === 'down') return 'text-danger bg-danger/10'
  return 'text-gray-500 bg-gray-100'
})
</script>

<template>
  <div class="bg-surface rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-300">
      <component :is="icon" v-if="icon" class="w-16 h-16" />
    </div>
    
    <div class="flex justify-between items-start mb-2 relative z-10">
      <div class="text-sm font-medium text-gray-500">{{ title }}</div>
      <div v-if="icon" class="p-2 bg-primary-blue/10 text-primary-blue rounded-lg">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    
    <div class="flex items-baseline gap-2 relative z-10">
      <div class="text-2xl font-bold text-barber-navy tracking-tight">{{ formatValue(value) }}</div>
      <div v-if="trendValue" class="text-xs font-medium px-2 py-0.5 rounded-full" :class="trendColor">
        {{ trendValue }}
      </div>
    </div>
  </div>
</template>
