<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { pegawaiApi } from '@/api/pegawai'
import { unitApi } from '@/api/unit'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const auth = useAuthStore()

const loading = ref(false)
const pegawai = ref([])
const units = ref([])

const roleMeta = {
  super_admin: { label: 'Super Admin', severity: 'warn' },
  admin: { label: 'Admin', severity: 'info' },
  penerima: { label: 'Penerima', severity: 'secondary' },
  pimpinan: { label: 'Pimpinan', severity: 'success' },
}

const roleLabel = (role) => roleMeta[role]?.label || role
const roleSeverity = (role) => roleMeta[role]?.severity || 'secondary'
const unitName = (unitId) => units.value.find((u) => u.id === unitId)?.nama || '-'

async function loadData() {
  loading.value = true
  try {
    const [pegawaiRes, unitRes] = await Promise.all([pegawaiApi.getPegawaiList(), unitApi.getUnitList()])
    pegawai.value = pegawaiRes.data?.items || []
    units.value = unitRes.data?.items || []
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
  router.push(`/master/pegawai/${id}/edit`)
}

function handleDelete(id, nama) {
  confirm.require({
    message: `Hapus pegawai "${nama}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    accept: async () => {
      try {
        await pegawaiApi.deletePegawai(id)
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Pegawai dihapus', life: 3000 })
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
        <h3 class="text-xl font-semibold text-slate-900">Master Pegawai</h3>
        <p class="text-sm text-slate-500">Kelola pengguna aplikasi.</p>
      </div>
      <Button
        v-if="auth.isSuperAdmin"
        label="Tambah Pegawai"
        icon="pi pi-plus"
        @click="router.push('/master/pegawai/tambah')"
      />
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        :value="pegawai"
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
        <Column field="nama" header="Nama" sortable />
        <Column field="username" header="Username" sortable />
        <Column field="role" header="Role" sortable>
          <template #body="{ data }">
            <Tag :value="roleLabel(data.role)" :severity="roleSeverity(data.role)" />
          </template>
        </Column>
        <Column field="unit_id" header="Unit">
          <template #body="{ data }">{{ unitName(data.unit_id) }}</template>
        </Column>
        <Column field="email" header="Email" />
        <Column field="is_active" header="Status">
          <template #body="{ data }">
            <Tag :value="data.is_active === 'true' || data.is_active === true ? 'Aktif' : 'Nonaktif'" :severity="data.is_active === 'true' || data.is_active === true ? 'success' : 'danger'" />
          </template>
        </Column>
        <Column header="Aksi" style="width: 140px">
          <template #body="{ data }">
            <div v-if="auth.isSuperAdmin" class="flex gap-1">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Edit" @click="handleEdit(data.id)" />
              <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Hapus" @click="handleDelete(data.id, data.nama)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
