<script setup lang="ts">
import BrandLogo from '../brand/BrandLogo.vue'
import MobileBottomNav from './MobileBottomNav.vue'
import CommandDock from './CommandDock.vue'
import { Bell, User, Search } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Top Brand Rail -->
    <header class="bg-surface border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div class="flex items-center gap-4 lg:w-64">
        <BrandLogo size="md" />
      </div>
      
      <div class="hidden md:flex items-center flex-1 max-w-xl px-8">
        <div class="relative w-full">
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm khách hàng, hóa đơn, dịch vụ..." class="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all" />
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
        </button>
        <div class="flex items-center gap-2 pl-4 border-l border-border cursor-pointer">
          <div class="hidden md:flex flex-col items-end">
            <span class="text-sm font-semibold text-barber-navy">Admin</span>
            <span class="text-xs text-success flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span> Online
            </span>
          </div>
          <div class="w-9 h-9 rounded-full bg-barber-navy text-white flex items-center justify-center border-2 border-surface shadow-sm">
            <User class="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <CommandDock />
      
      <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div class="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <MobileBottomNav />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
