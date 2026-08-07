<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { pegawaiApi } from '@/api/pegawai'
import { unitApi } from '@/api/unit'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const isEdit = route.params.id !== undefined
const loading = ref(false)
const submitting = ref(false)
const units = ref([])

const roleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Penerima', value: 'penerima' },
  { label: 'Pimpinan', value: 'pimpinan' },
]

const form = ref({
  nama: '',
  username: '',
  password: '',
  role: 'admin',
  unit_id: '',
  no_hp: '',
  email: '',
  is_active: true,
})

onMounted(async () => {
  try {
    const unitRes = await unitApi.getUnitList()
    units.value = unitRes.data?.items || []
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data unit', life: 5000 })
  }

  if (isEdit) {
    loading.value = true
    try {
      const response = await pegawaiApi.getPegawai(route.params.id)
      const p = response.data
      form.value = {
        nama: p.nama || '',
        username: p.username || '',
        password: '',
        role: p.role || 'admin',
        unit_id: p.unit_id || '',
        no_hp: p.no_hp || '',
        email: p.email || '',
        is_active: p.is_active === 'true' || p.is_active === true,
      }
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Gagal Memuat Data',
        detail: e.response?.data?.message || 'Terjadi kesalahan',
        life: 5000,
      })
      router.push('/master/pegawai')
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    const payload = { ...form.value }
    if (isEdit && !payload.password) {
      delete payload.password
    }
    if (isEdit) {
      await pegawaiApi.updatePegawai(route.params.id, payload)
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Pegawai diperbarui', life: 3000 })
    } else {
      await pegawaiApi.createPegawai(payload)
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Pegawai dibuat', life: 3000 })
    }
    router.push('/master/pegawai')
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Menyimpan',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
      <h3 class="text-xl font-semibold text-slate-900">{{ isEdit ? 'Edit Pegawai' : 'Tambah Pegawai' }}</h3>
    </div>

    <form class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="nama" class="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
          <InputText id="nama" v-model="form.nama" class="w-full" placeholder="Nama pegawai" required />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="username" class="mb-1 block text-sm font-medium text-slate-700">Username</label>
            <InputText id="username" v-model="form.username" class="w-full" placeholder="Username login" required />
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
              {{ isEdit ? 'Password Baru (opsional)' : 'Password' }}
            </label>
            <InputText
              id="password"
              v-model="form.password"
              type="password"
              class="w-full"
              :placeholder="isEdit ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'"
              :required="!isEdit"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="role" class="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              id="role"
              v-model="form.role"
              class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
              required
            >
              <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label for="unit_id" class="mb-1 block text-sm font-medium text-slate-700">Unit</label>
            <select
              id="unit_id"
              v-model="form.unit_id"
              class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
            >
              <option value="">- Tidak ada -</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.nama }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label for="no_hp" class="mb-1 block text-sm font-medium text-slate-700">No. HP</label>
            <InputText id="no_hp" v-model="form.no_hp" class="w-full" placeholder="08xxxxxxxxxx" />
          </div>

          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <InputText id="email" v-model="form.email" type="email" class="w-full" placeholder="email@example.com" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input id="is_active" v-model="form.is_active" type="checkbox" class="h-5 w-5 rounded border-slate-300 accent-slate-900" />
          <label for="is_active" class="text-sm text-slate-700">Akun aktif</label>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button label="Batal" severity="secondary" @click="router.push('/master/pegawai')" />
          <Button label="Simpan" icon="pi pi-check" type="submit" :loading="submitting" />
        </div>
      </div>
    </form>
  </div>
</template>
