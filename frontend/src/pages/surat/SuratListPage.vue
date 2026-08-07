<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { suratApi } from '@/api/surat'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const auth = useAuthStore()

const loading = ref(false)
const surats = ref([])
const search = ref('')
const statusFilter = ref('')

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Menunggu Pengambilan', value: 'menunggu_pengambilan' },
  { label: 'Diterima', value: 'diterima' },
]

const formatStatus = (status) => {
  const map = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-600' },
    menunggu_pengambilan: { label: 'Menunggu Pengambilan', class: 'bg-amber-100 text-amber-700' },
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

async function loadData() {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value
    const response = await suratApi.getSuratList(params)
    surats.value = response.data?.items || []
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

function handleDetail(id) {
  router.push(`/surat/${id}`)
}

function handleDelete(id, nomor) {
  confirm.require({
    message: `Hapus surat "${nomor}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    accept: async () => {
      try {
        await suratApi.deleteSurat(id)
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Surat dihapus', life: 3000 })
        loadData()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: e.response?.data?.message || 'Terjadi kesalahan',
          life: 5000,
        })
      }
    },
  })
}

onMounted(loadData)
</script>

<template>
  <div class="space-y-4">
    <ConfirmDialog />
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-xl font-semibold text-slate-900">Surat Keluar</h3>
        <p class="text-sm text-slate-500">Kelola surat keluar dan ekspedisi.</p>
      </div>
      <Button label="Tambah Surat" icon="pi pi-plus" @click="router.push('/surat/tambah')" />
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <InputText
        v-model="search"
        placeholder="Cari nomor surat, perihal..."
        class="w-full sm:max-w-xs"
        @keyup.enter="loadData"
      />
      <Select
        v-model="statusFilter"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-full sm:w-64"
        @change="loadData"
      />
      <Button label="Cari" icon="pi pi-search" @click="loadData" />
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        :value="surats"
        :loading="loading"
        data-key="id"
        :paginator="true"
        :rows="10"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="text-sm"
      >
        <template #empty>
          <div class="py-8 text-center text-slate-400">
            <i class="pi pi-inbox mb-2 block text-3xl"></i>
            Belum ada data.
          </div>
        </template>
        <Column field="nomor_surat" header="Nomor Surat" sortable />
        <Column field="tanggal_surat" header="Tanggal" sortable>
          <template #body="{ data }">{{ formatTanggal(data.tanggal_surat) }}</template>
        </Column>
        <Column field="perihal" header="Perihal" />
        <Column field="unit_name" header="Unit" />
        <Column field="nomor_ekspedisi" header="No. Ekspedisi" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="formatStatus(data.status).class"
            >
              {{ formatStatus(data.status).label }}
            </span>
          </template>
        </Column>
        <Column header="Aksi" style="width: 140px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-eye" severity="secondary" text rounded aria-label="Lihat detail" @click="handleDetail(data.id)" />
              <Button
                v-if="auth.isSuperAdmin"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                aria-label="Hapus"
                @click="handleDelete(data.id, data.nomor_surat)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
