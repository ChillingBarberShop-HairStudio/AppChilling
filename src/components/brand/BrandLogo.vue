<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  lightText?: boolean
}>()

const imgSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6'
    case 'md': return 'h-8'
    case 'lg': return 'h-12'
    case 'xl': return 'h-24'
    default: return 'h-8'
  }
})

const textSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-sm'
    case 'md': return 'text-lg'
    case 'lg': return 'text-2xl'
    case 'xl': return 'text-4xl'
    default: return 'text-lg'
  }
})
</script>

<template>
  <div class="flex items-center gap-3">
    <img src="/Logo.PNG" alt="Chilling Barber Logo" :class="['object-contain', imgSize]" />
    <div v-if="showText" class="font-bold tracking-tight" :class="[textSize, lightText ? 'text-white' : 'text-barber-navy']">
      CHILLING <span class="font-light text-primary-blue">STUDIO</span>
    </div>
  </div>
</template>
