<script setup lang="ts">
defineProps<{
  title: string
  icon: any
  color?: 'blue' | 'red' | 'gold' | 'gray'
}>()

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
  red: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
  gold: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
  gray: 'bg-gray-100 text-gray-600 group-hover:bg-gray-800 group-hover:text-white',
}
</script>

<template>
  <button class="group flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-surface hover:shadow-md transition-all duration-200 active:scale-95">
    <div class="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-200 shadow-sm" :class="colorClasses[color || 'blue']">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <span class="text-sm font-medium text-gray-700 group-hover:text-barber-navy">{{ title }}</span>
  </button>
</template>
