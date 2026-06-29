<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { supabase } from '../lib/supabase'

const activeTab = ref<'inventory' | 'import' | 'export' | 'history'>('inventory')

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  current_stock: number
  unit: string
}

interface Transaction {
  id: string
  inventory_id: string
  transaction_type: string
  quantity: number
  note: string
  created_at: string
  inventory?: {
    name: string
    sku: string
  }
}

const inventoryList = ref<InventoryItem[]>([])
const historyList = ref<Transaction[]>([])

const stats = ref({
  totalItems: 0,
  imported90Days: 0,
  exported90Days: 0
})

const isLoading = ref(true)

const fetchInventory = async () => {
  const { data } = await supabase.from('inventory').select('*').order('name')
  if (data) inventoryList.value = data
}

const fetchHistory = async () => {
  const { data } = await supabase
    .from('inventory_transactions')
    .select('*, inventory(name, sku)')
    .order('created_at', { ascending: false })
  if (data) historyList.value = data
}

const calculateStats = () => {
  stats.value.totalItems = inventoryList.value.length

  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000))

  let imported = 0
  let exported = 0

  historyList.value.forEach(tx => {
    const txDate = new Date(tx.created_at)
    if (txDate >= ninetyDaysAgo) {
      if (tx.transaction_type === 'import') imported += tx.quantity
      if (tx.transaction_type === 'export') exported += tx.quantity
    }
  })

  stats.value.imported90Days = imported
  stats.value.exported90Days = exported
}

const loadData = async () => {
  isLoading.value = true
  await Promise.all([fetchInventory(), fetchHistory()])
  calculateStats()
  isLoading.value = false
}

onMounted(() => {
  loadData()
})

// === MODAL STATE ===
const showAddModal = ref(false)
const showTxModal = ref(false)
const txType = ref<'import' | 'export'>('import')

const newItem = ref({
  sku: '',
  name: '',
  category: 'Hóa chất',
  unit: 'Chai'
})

const txForm = ref({
  inventory_id: '',
  quantity: 1,
  note: ''
})

const addItem = async () => {
  await supabase.from('inventory').insert([newItem.value])
  showAddModal.value = false
  newItem.value = { sku: '', name: '', category: 'Hóa chất', unit: 'Chai' }
  loadData()
}

const submitTx = async () => {
  if (!txForm.value.inventory_id || txForm.value.quantity <= 0) return

  // 1. Lấy tồn kho hiện tại
  const item = inventoryList.value.find(i => i.id === txForm.value.inventory_id)
  if (!item) return

  let newStock = item.current_stock
  if (txType.value === 'import') {
    newStock += txForm.value.quantity
  } else {
    if (newStock < txForm.value.quantity) {
      return alert('Số lượng tồn kho không đủ để xuất!')
    }
    newStock -= txForm.value.quantity
  }

  // 2. Cập nhật tồn kho
  await supabase.from('inventory').update({ current_stock: newStock }).eq('id', item.id)

  // 3. Thêm lịch sử
  await supabase.from('inventory_transactions').insert([{
    inventory_id: item.id,
    transaction_type: txType.value,
    quantity: txForm.value.quantity,
    note: txForm.value.note
  }])

  showTxModal.value = false
  txForm.value = { inventory_id: '', quantity: 1, note: '' }
  loadData()
}

const openTxModal = (type: 'import' | 'export') => {
  txType.value = type
  showTxModal.value = true
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('vi-VN')
}
</script>

<template>
  <div class="space-y-6 pb-24 p-4 max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Kho hàng</h1>
        <p class="text-sm text-gray-500">Quản lý xuất/nhập nguyên vật liệu và lịch sử giao dịch (90 ngày).</p>
      </div>
      <button @click="showAddModal = true" class="bg-primary-blue text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-sm w-full md:w-auto">
        <PlusIcon class="w-5 h-5" /> Thêm mặt hàng
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-primary-blue rounded-xl flex items-center justify-center">
          <PlusIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Tổng mặt hàng</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.totalItems }}</p>
        </div>
      </div>
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-green-50 text-success rounded-xl flex items-center justify-center">
          <ArrowDownTrayIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Đã nhập (90 ngày)</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.imported90Days }}</p>
        </div>
      </div>
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
          <ArrowUpTrayIcon class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Đã xuất (90 ngày)</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.exported90Days }}</p>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="flex gap-2 bg-gray-100/50 p-1 rounded-xl w-fit">
      <button @click="activeTab = 'inventory'" :class="activeTab === 'inventory' ? 'bg-white shadow-sm text-primary-blue' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 rounded-lg font-medium text-sm transition-all">Tồn kho</button>
      <button @click="openTxModal('import')" class="px-4 py-2 rounded-lg font-medium text-sm transition-all text-gray-500 hover:text-gray-700 hover:bg-white flex items-center gap-1">
        <ArrowDownTrayIcon class="w-4 h-4" /> Nhập kho
      </button>
      <button @click="openTxModal('export')" class="px-4 py-2 rounded-lg font-medium text-sm transition-all text-gray-500 hover:text-gray-700 hover:bg-white flex items-center gap-1">
        <ArrowUpTrayIcon class="w-4 h-4" /> Xuất kho
      </button>
      <button @click="activeTab = 'history'" :class="activeTab === 'history' ? 'bg-white shadow-sm text-primary-blue' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1">
        <ClockIcon class="w-4 h-4" /> Lịch sử
      </button>
    </div>

    <div v-if="isLoading" class="py-12 flex justify-center">
      <div class="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- INVENTORY TAB -->
    <div v-else-if="activeTab === 'inventory'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th class="px-6 py-4 font-medium">Mã SKU</th>
            <th class="px-6 py-4 font-medium">Tên mặt hàng</th>
            <th class="px-6 py-4 font-medium">Danh mục</th>
            <th class="px-6 py-4 font-medium">Tồn kho</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in inventoryList" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.sku }}</td>
            <td class="px-6 py-4 text-sm font-semibold text-primary-blue">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ item.category }}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" :class="item.current_stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-success'">
                {{ item.current_stock }} {{ item.unit }}
              </span>
            </td>
          </tr>
          <tr v-if="inventoryList.length === 0">
            <td colspan="4" class="text-center py-8 text-gray-500">Chưa có mặt hàng nào.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- HISTORY TAB -->
    <div v-else-if="activeTab === 'history'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th class="px-6 py-4 font-medium">Thời gian</th>
            <th class="px-6 py-4 font-medium">Mặt hàng</th>
            <th class="px-6 py-4 font-medium">Loại GD</th>
            <th class="px-6 py-4 font-medium">Số lượng</th>
            <th class="px-6 py-4 font-medium">Ghi chú</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="tx in historyList" :key="tx.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(tx.created_at) }}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ tx.inventory?.name || 'Không rõ' }}</td>
            <td class="px-6 py-4">
              <span v-if="tx.transaction_type === 'import'" class="text-xs font-bold text-success bg-green-50 px-2 py-1 rounded">NHẬP</span>
              <span v-else class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">XUẤT</span>
            </td>
            <td class="px-6 py-4 text-sm font-medium" :class="tx.transaction_type === 'import' ? 'text-success' : 'text-amber-600'">
              {{ tx.transaction_type === 'import' ? '+' : '-' }}{{ tx.quantity }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{{ tx.note || '-' }}</td>
          </tr>
          <tr v-if="historyList.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-500">Chưa có giao dịch nào (Trong 90 ngày qua).</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL THÊM MẶT HÀNG -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">Thêm mặt hàng mới</h3>
        </div>
        <form @submit.prevent="addItem" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã SKU (Tuỳ chọn)</label>
            <input v-model="newItem.sku" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên mặt hàng *</label>
            <input v-model="newItem.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select v-model="newItem.category" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none">
                <option>Hóa chất</option>
                <option>Dụng cụ</option>
                <option>Phụ liệu</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
              <input v-model="newItem.unit" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl">Hủy</button>
            <button type="submit" class="px-5 py-2.5 bg-primary-blue hover:bg-blue-600 text-white font-medium rounded-xl">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL NHẬP/XUẤT -->
    <div v-if="showTxModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold" :class="txType === 'import' ? 'text-success' : 'text-amber-600'">
            {{ txType === 'import' ? 'Phiếu Nhập Kho' : 'Phiếu Xuất Kho' }}
          </h3>
        </div>
        <form @submit.prevent="submitTx" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mặt hàng *</label>
            <select v-model="txForm.inventory_id" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none">
              <option value="" disabled>Chọn mặt hàng</option>
              <option v-for="item in inventoryList" :key="item.id" :value="item.id">{{ item.name }} (Tồn: {{ item.current_stock }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
            <input v-model="txForm.quantity" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
            <input v-model="txForm.note" type="text" placeholder="Lý do xuất/nhập..." class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showTxModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl">Hủy</button>
            <button type="submit" class="px-5 py-2.5 text-white font-medium rounded-xl" :class="txType === 'import' ? 'bg-success hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
