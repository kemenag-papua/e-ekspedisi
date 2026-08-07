<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { unitApi } from '@/api/unit'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const auth = useAuthStore()

const loading = ref(false)
const units = ref([])

const formatTanggal = (value) => {
  if (!value) return '-'
  return value
}

async function loadData() {
  loading.value = true
  try {
    const response = await unitApi.getUnitList()
    units.value = response.data?.items || []
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

function handleEdit(id) {
  router.push(`/master/unit/${id}/edit`)
}

function handleDelete(id, nama) {
  confirm.require({
    message: `Hapus unit "${nama}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    accept: async () => {
      try {
        await unitApi.deleteUnit(id)
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit dihapus', life: 3000 })
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
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-semibold text-slate-900">Master Unit</h3>
        <p class="text-sm text-slate-500">Kelola unit kerja.</p>
      </div>
      <Button
        v-if="auth.isSuperAdmin"
        label="Tambah Unit"
        icon="pi pi-plus"
        @click="router.push('/master/unit/tambah')"
      />
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        :value="units"
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
        <Column field="nama" header="Nama Unit" sortable />
        <Column field="keterangan" header="Keterangan" />
        <Column field="created_at" header="Dibuat" sortable>
          <template #body="{ data }">{{ formatTanggal(data.created_at) }}</template>
        </Column>
        <Column header="Aksi" style="width: 140px">
          <template #body="{ data }">
            <div v-if="auth.isSuperAdmin" class="flex gap-1">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Edit" @click="handleEdit(data.id)" />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                aria-label="Hapus"
                @click="handleDelete(data.id, data.nama)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
