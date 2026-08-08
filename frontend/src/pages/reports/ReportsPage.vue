<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { reportsApi } from '@/api/reports'
import { unitApi } from '@/api/unit'
import { exportToCsv } from '@/utils/csv'

const toast = useToast()

const loading = ref(false)
const reports = ref([])
const summary = ref({ total: 0, draft: 0, menunggu: 0, diterima: 0, unitTerbanyak: '' })
const units = ref([])

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Menunggu Pengambilan', value: 'menunggu_pengambilan' },
  { label: 'Diterima', value: 'diterima' },
]

const filters = ref({
  dateFrom: '',
  dateTo: '',
  status: '',
  unitId: '',
  search: '',
})

function setDefaultDateRange() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const toIso = (d) => d.toISOString().split('T')[0]
  filters.value.dateFrom = toIso(firstDay)
  filters.value.dateTo = toIso(now)
}

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatStatus = (status) => {
  const map = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-600' },
    menunggu_pengambilan: { label: 'Menunggu Pengambilan', class: 'bg-amber-100 text-amber-700' },
    diterima: { label: 'Diterima', class: 'bg-green-100 text-green-700' },
  }
  return map[status] || { label: status, class: 'bg-slate-100 text-slate-600' }
}

async function loadData() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.dateFrom) params.dateFrom = filters.value.dateFrom
    if (filters.value.dateTo) params.dateTo = filters.value.dateTo
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.unitId) params.unit = filters.value.unitId
    if (filters.value.search) params.search = filters.value.search

    const response = await reportsApi.getSuratReport(params)
    reports.value = response.data?.items || []
    summary.value = response.data?.summary || { total: 0, draft: 0, menunggu: 0, diterima: 0, unitTerbanyak: '' }
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Data',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = { dateFrom: '', dateTo: '', status: '', unitId: '', search: '' }
  setDefaultDateRange()
  loadData()
}

function handleExport() {
  const headers = ['No', 'Nomor Surat', 'Tanggal', 'Perihal', 'Unit', 'Status', 'Nomor Ekspedisi']
  const rows = reports.value.map((s, i) => [
    i + 1,
    s.nomor_surat,
    formatTanggal(s.tanggal_surat),
    s.perihal,
    s.unit_name || '',
    formatStatus(s.status).label,
    s.nomor_ekspedisi || '',
  ])
  exportToCsv(headers, rows, `laporan-surat-${filters.value.dateFrom || 'all'}-${filters.value.dateTo || 'all'}`)
  toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Laporan diekspor', life: 3000 })
}

onMounted(async () => {
  setDefaultDateRange()
  try {
    const unitRes = await unitApi.getUnitList()
    units.value = unitRes.data?.items || []
  } catch {
    // Abaikan jika gagal memuat unit
  }
  loadData()
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-xl font-semibold text-slate-900">Laporan Surat Keluar</h3>
      <p class="text-sm text-slate-500">Rekapitulasi surat keluar dengan filter dan ekspor CSV.</p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Dari Tanggal</label>
          <InputText v-model="filters.dateFrom" type="date" class="w-full" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Sampai Tanggal</label>
          <InputText v-model="filters.dateTo" type="date" class="w-full" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Status</label>
          <Select v-model="filters.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Unit</label>
          <Select
            v-model="filters.unitId"
            :options="units"
            option-label="nama"
            option-value="id"
            show-clear
            placeholder="Semua unit"
            class="w-full"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Cari</label>
          <InputText v-model="filters.search" placeholder="Nomor / perihal" class="w-full" @keyup.enter="loadData" />
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <Button label="Terapkan" icon="pi pi-search" @click="loadData" />
        <Button label="Reset" icon="pi pi-refresh" severity="secondary" @click="resetFilters" />
        <div class="ml-auto">
          <Button label="Export CSV" icon="pi pi-download" severity="success" :disabled="reports.length === 0" @click="handleExport" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs text-slate-500">Total Surat</p>
        <p class="mt-1 text-2xl font-bold text-slate-900">{{ summary.total }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs text-slate-500">Draft</p>
        <p class="mt-1 text-2xl font-bold text-slate-600">{{ summary.draft }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs text-slate-500">Menunggu Pengambilan</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ summary.menunggu }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs text-slate-500">Diterima</p>
        <p class="mt-1 text-2xl font-bold text-green-600">{{ summary.diterima }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        :value="reports"
        :loading="loading"
        data-key="id"
        :paginator="true"
        :rows="20"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="text-sm"
      >
        <template #empty>
          <div class="py-8 text-center text-slate-400">
            <i class="pi pi-inbox mb-2 block text-3xl"></i>
            Tidak ada data untuk filter ini.
          </div>
        </template>
        <Column header="No" style="width: 60px">
          <template #body="{ index }">{{ index + 1 }}</template>
        </Column>
        <Column field="nomor_surat" header="Nomor Surat" sortable />
        <Column field="tanggal_surat" header="Tanggal" sortable>
          <template #body="{ data }">{{ formatTanggal(data.tanggal_surat) }}</template>
        </Column>
        <Column field="perihal" header="Perihal" />
        <Column field="unit_name" header="Unit" />
        <Column field="nomor_ekspedisi" header="No. Ekspedisi" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="formatStatus(data.status).class">
              {{ formatStatus(data.status).label }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
