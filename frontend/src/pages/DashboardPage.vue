<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const statCards = [
  { label: 'Total Surat', value: 0, icon: 'pi pi-file', color: 'bg-blue-50 text-blue-600' },
  { label: 'Menunggu Pengambilan', value: 0, icon: 'pi pi-hourglass', color: 'bg-amber-50 text-amber-600' },
  { label: 'Diterima', value: 0, icon: 'pi pi-check-circle', color: 'bg-green-50 text-green-600' },
  { label: 'Draft', value: 0, icon: 'pi pi-pencil', color: 'bg-slate-50 text-slate-600' },
]

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Surat Keluar',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#0f172a',
      backgroundColor: 'rgba(15, 23, 42, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
})

const chartOptions = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#334155' } },
  },
  scales: {
    x: { ticks: { color: '#475569' }, grid: { color: '#e2e8f0' } },
    y: { beginAtZero: true, ticks: { color: '#475569' }, grid: { color: '#e2e8f0' } },
  },
})

onMounted(async () => {
  // TODO: Sprint 7 - fetch data dari /dashboard/summary dan /dashboard/chart
  // const { data } = await dashboardApi.getSummary()
  // update statCards dan chartData
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-xl font-semibold text-slate-900">
        Selamat datang, {{ auth.user?.nama || 'Pengguna' }}
      </h3>
      <p class="text-sm text-slate-500">Ringkasan aktivitas persuratan hari ini.</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">{{ card.label }}</p>
            <p class="mt-1 text-3xl font-bold text-slate-900">{{ card.value }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg" :class="card.color">
            <i :class="card.icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 class="mb-4 text-base font-semibold text-slate-900">Statistik Surat Bulanan</h4>
      <div class="h-80">
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>
