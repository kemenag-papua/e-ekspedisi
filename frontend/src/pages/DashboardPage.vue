<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import { dashboardApi } from '@/api/dashboard'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)

const statCards = ref([
  { label: 'Total Surat', value: 0, icon: 'pi pi-file', color: 'bg-blue-50 text-blue-600', to: '/surat' },
  { label: 'Menunggu Pengambilan', value: 0, icon: 'pi pi-hourglass', color: 'bg-amber-50 text-amber-600', to: '/surat' },
  { label: 'Diterima Hari Ini', value: 0, icon: 'pi pi-check-circle', color: 'bg-green-50 text-green-600', to: '/surat' },
  { label: 'Audit Hari Ini', value: 0, icon: 'pi pi-history', color: 'bg-slate-50 text-slate-600', to: '/audit' },
])

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Dibuat',
      data: [],
      borderColor: '#0f172a',
      backgroundColor: 'rgba(15, 23, 42, 0.1)',
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Diterima',
      data: [],
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.1)',
      tension: 0.4,
      fill: false,
    },
  ],
})

const chartOptions = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#334155', usePointStyle: true } },
  },
  scales: {
    x: { ticks: { color: '#475569', maxRotation: 45 }, grid: { color: '#e2e8f0' } },
    y: { beginAtZero: true, ticks: { color: '#475569', precision: 0 }, grid: { color: '#e2e8f0' } },
  },
})

const recentSurat = ref([])
const recentActivity = ref([])

const formatStatus = (status) => {
  const map = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-600' },
    menunggu_pengambilan: { label: 'Menunggu', class: 'bg-amber-100 text-amber-700' },
    diterima: { label: 'Diterima', class: 'bg-green-100 text-green-700' },
  }
  return map[status] || { label: status, class: 'bg-slate-100 text-slate-600' }
}

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatWaktu = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const aksiLabel = (aksi) => {
  const map = {
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    CREATE_SURAT: 'Buat Surat',
    CREATE_EKSPEDISI: 'Buat Ekspedisi',
    UPDATE_SURAT: 'Ubah Surat',
    DELETE_SURAT: 'Hapus Surat',
    CONFIRM_PENERIMAAN: 'Konfirmasi',
    GENERATE_PDF: 'Generate PDF',
    REGENERATE_QR: 'Regenerate QR',
  }
  return map[aksi] || aksi || '-'
}

onMounted(async () => {
  loading.value = true
  try {
    const [summaryRes, chartRes, recentRes] = await Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getChart(),
      dashboardApi.getRecent({ limit: 5 }),
    ])

    const s = summaryRes.data || {}
    statCards.value[0].value = s.totalSurat || 0
    statCards.value[1].value = s.menungguPengambilan || 0
    statCards.value[2].value = s.diterimaHariIni || 0
    statCards.value[3].value = s.auditHariIni || 0

    const c = chartRes.data || {}
    chartData.value.labels = c.labels || []
    if (c.datasets) {
      chartData.value.datasets[0].data = c.datasets.dibuat || []
      chartData.value.datasets[1].data = c.datasets.diterima || []
    }

    const r = recentRes.data || {}
    recentSurat.value = r.suratTerbaru || []
    recentActivity.value = r.aktivitasTerakhir || []
  } catch {
    // Biarkan data kosong jika gagal memuat
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-xl font-semibold text-slate-900">
        Selamat datang, {{ auth.user?.nama || 'Pengguna' }}
      </h3>
      <p class="text-sm text-slate-500">Ringkasan aktivitas persuratan.</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        @click="card.to && router.push(card.to)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">{{ card.label }}</p>
            <p v-if="loading" class="mt-1 h-8 w-12 animate-pulse rounded bg-slate-200"></p>
            <p v-else class="mt-1 text-3xl font-bold text-slate-900">{{ card.value }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg" :class="card.color">
            <i :class="card.icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 class="mb-4 text-base font-semibold text-slate-900">Statistik Surat Bulanan</h4>
      <div v-if="loading" class="h-80 animate-pulse rounded bg-slate-100"></div>
      <div v-else class="h-80">
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Surat Terbaru</h4>
          <Button v-if="auth.isAdmin || auth.isSuperAdmin" label="Lihat Semua" severity="secondary" text size="small" @click="router.push('/surat')" />
        </div>
        <div class="p-3">
          <div v-if="loading" class="space-y-2 p-2">
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
          </div>
          <div v-else-if="recentSurat.length === 0" class="py-8 text-center text-sm text-slate-400">
            Belum ada surat.
          </div>
          <ul v-else class="divide-y divide-slate-100">
            <li
              v-for="s in recentSurat"
              :key="s.id"
              class="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
              @click="router.push(`/surat/${s.id}`)"
            >
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <i class="pi pi-file text-slate-500"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ s.nomor_surat }}</p>
                <p class="truncate text-xs text-slate-500">{{ s.perihal }}</p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="formatStatus(s.status).class">
                  {{ formatStatus(s.status).label }}
                </span>
                <span class="text-xs text-slate-400">{{ formatTanggal(s.tanggal_surat) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Aktivitas Terakhir</h4>
          <Button v-if="auth.isAdmin || auth.isSuperAdmin" label="Lihat Semua" severity="secondary" text size="small" @click="router.push('/audit')" />
        </div>
        <div class="p-3">
          <div v-if="loading" class="space-y-2 p-2">
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
            <div class="h-10 animate-pulse rounded bg-slate-100"></div>
          </div>
          <div v-else-if="recentActivity.length === 0" class="py-8 text-center text-sm text-slate-400">
            Belum ada aktivitas.
          </div>
          <ul v-else class="divide-y divide-slate-100">
            <li v-for="a in recentActivity" :key="a.id" class="flex items-center gap-3 rounded-lg p-2">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <i class="pi pi-history text-slate-500"></i>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ aksiLabel(a.aksi) }}</p>
                <p class="text-xs text-slate-500">{{ a.user }}</p>
              </div>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="a.hasil === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ a.hasil }}
              </span>
              <span class="text-xs text-slate-400">{{ formatWaktu(a.waktu) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
