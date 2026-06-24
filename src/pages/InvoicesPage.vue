<script setup lang="ts">
import { Search, Filter, Plus, Printer, WalletCards } from 'lucide-vue-next'
import AppCard from '../components/ui/AppCard.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import { mockInvoices } from '../data/mockData'

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-barber-navy">Quản lý hóa đơn</h1>
        <p class="text-sm text-gray-500">Xem và xử lý tất cả hóa đơn của cửa hàng.</p>
      </div>
      <button class="bg-primary-blue text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto">
        <Plus class="w-4 h-4" /> Tạo hóa đơn
      </button>
    </div>

    <AppCard no-padding>
      <!-- Toolbar -->
      <div class="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
        <div class="flex-1 max-w-md relative">
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm theo mã HĐ, tên KH, SĐT..." class="w-full bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all shadow-sm" />
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
            <Filter class="w-4 h-4" /> Bộ lọc
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-border text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-4 w-32">Mã HĐ</th>
              <th class="px-5 py-4 min-w-[150px]">Khách hàng</th>
              <th class="px-5 py-4">Tổng tiền</th>
              <th class="px-5 py-4 hidden md:table-cell">Còn nợ</th>
              <th class="px-5 py-4 hidden sm:table-cell">Trạng thái</th>
              <th class="px-5 py-4 hidden lg:table-cell">Thời gian</th>
              <th class="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="inv in mockInvoices" :key="inv.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-5 py-4 font-medium text-primary-blue">{{ inv.id }}</td>
              <td class="px-5 py-4">
                <div class="font-medium text-barber-navy">{{ inv.customer }}</div>
                <div class="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{{ inv.service }}</div>
                <!-- Mobile Status -->
                <div class="sm:hidden mt-2">
                  <StatusBadge :status="inv.status" type="invoice" />
                </div>
              </td>
              <td class="px-5 py-4">
                <div class="font-semibold text-barber-navy">{{ formatCurrency(inv.total) }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ inv.method }}</div>
              </td>
              <td class="px-5 py-4 hidden md:table-cell">
                <span :class="inv.debt > 0 ? 'text-danger font-medium' : 'text-gray-500'">
                  {{ formatCurrency(inv.debt) }}
                </span>
              </td>
              <td class="px-5 py-4 hidden sm:table-cell">
                <StatusBadge :status="inv.status" type="invoice" />
              </td>
              <td class="px-5 py-4 hidden lg:table-cell text-sm text-gray-500">
                {{ inv.time }}<br />
                <span class="text-xs">{{ inv.date }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 text-gray-500 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors" title="Thanh toán">
                    <WalletCards class="w-4 h-4" />
                  </button>
                  <button class="p-2 text-gray-500 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors" title="In">
                    <Printer class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination (Mock) -->
      <div class="p-4 border-t border-border flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
        <div>Hiển thị 1-5 của 24 hóa đơn</div>
        <div class="flex items-center gap-1">
          <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Trước</button>
          <button class="px-3 py-1 bg-primary-blue text-white rounded font-medium">1</button>
          <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">2</button>
          <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">3</button>
          <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">Sau</button>
        </div>
      </div>
    </AppCard>
  </div>
</template>
