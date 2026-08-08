<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { auditApi } from '@/api/audit'
import { exportToCsv } from '@/utils/csv'

const toast = useToast()

const loading = ref(false)
const logs = ref([])
const userFilter = ref('')
const aksiFilter = ref('')

const aksiOptions = [
  { label: 'Semua Aksi', value: '' },
  { label: 'Login', value: 'LOGIN' },
  { label: 'Logout', value: 'LOGOUT' },
  { label: 'Buat Surat', value: 'CREATE_SURAT' },
  { label: 'Buat Ekspedisi', value: 'CREATE_EKSPEDISI' },
  { label: 'Ubah Surat', value: 'UPDATE_SURAT' },
  { label: 'Hapus Surat', value: 'DELETE_SURAT' },
  { label: 'Konfirmasi Penerimaan', value: 'CONFIRM_PENERIMAAN' },
  { label: 'Generate PDF', value: 'GENERATE_PDF' },
  { label: 'Regenerate QR', value: 'REGENERATE_QR' },
  { label: 'Kelola Unit', value: 'CREATE_UNIT' },
  { label: 'Kelola Pegawai', value: 'CREATE_PEGAWAI' },
]

const formatWaktu = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const aksiLabel = (aksi) => {
  const found = aksiOptions.find((o) => o.value === aksi)
  if (found) return found.label
  return aksi || '-'
}

async function loadData() {
  loading.value = true
  try {
    const params = { limit: 100 }
    if (userFilter.value) params.user = userFilter.value
    if (aksiFilter.value) params.aksi = aksiFilter.value
    const response = await auditApi.getAuditList(params)
    logs.value = response.data?.items || []
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

function handleExport() {
  const headers = ['Waktu', 'Pengguna', 'Aktivitas', 'Objek', 'Hasil']
  const rows = logs.value.map((l) => [
    formatWaktu(l.waktu),
    l.user,
    aksiLabel(l.aksi),
    l.objek,
    l.hasil,
  ])
  exportToCsv(headers, rows, `audit-trail-${new Date().toISOString().split('T')[0]}`)
  toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Audit log diekspor', life: 3000 })
}

onMounted(loadData)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-xl font-semibold text-slate-900">Audit Trail</h3>
      <p class="text-sm text-slate-500">Riwayat seluruh aktivitas pengguna di sistem.</p>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <InputText
        v-model="userFilter"
        placeholder="Cari pengguna..."
        class="w-full sm:max-w-xs"
        @keyup.enter="loadData"
      />
      <Select
        v-model="aksiFilter"
        :options="aksiOptions"
        option-label="label"
        option-value="value"
        class="w-full sm:w-64"
        @change="loadData"
      />
      <div class="flex gap-2">
        <Button label="Cari" icon="pi pi-search" @click="loadData" />
        <Button label="Export CSV" icon="pi pi-download" severity="success" :disabled="logs.length === 0" @click="handleExport" />
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        :value="logs"
        :loading="loading"
        data-key="id"
        :paginator="true"
        :rows="20"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="text-sm"
      >
        <template #empty>
          <div class="py-8 text-center text-slate-400">
            <i class="pi pi-history mb-2 block text-3xl"></i>
            Belum ada aktivitas.
          </div>
        </template>
        <Column header="Waktu" style="width: 180px">
          <template #body="{ data }">{{ formatWaktu(data.waktu) }}</template>
        </Column>
        <Column field="user" header="Pengguna" sortable />
        <Column field="aksi" header="Aktivitas" sortable>
          <template #body="{ data }">{{ aksiLabel(data.aksi) }}</template>
        </Column>
        <Column field="objek" header="Objek" />
        <Column field="hasil" header="Hasil" style="width: 120px">
          <template #body="{ data }">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="data.hasil === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ data.hasil }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
