<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const surats = ref([])

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

onMounted(async () => {
  loading.value = true
  try {
    // TODO: Sprint 3 - fetch data dari /surat
    surats.value = []
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
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-semibold text-slate-900">Surat Keluar</h3>
        <p class="text-sm text-slate-500">Kelola surat keluar dan ekspedisi.</p>
      </div>
      <Button label="Tambah Surat" icon="pi pi-plus" @click="router.push('/surat/tambah')" />
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
        <Column field="unit" header="Unit" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="formatStatus(data.status).class">
              {{ formatStatus(data.status).label }}
            </span>
          </template>
        </Column>
        <Column header="Aksi" style="width: 100px">
          <template #body>
            <Button
              icon="pi pi-eye"
              severity="secondary"
              text
              rounded
              aria-label="Lihat detail"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
