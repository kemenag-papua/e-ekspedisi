import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')

// Supresi PrimeVue 5 / PrimeUI license warning (community version).
// Warning muncul sebagai toast overlay yang bisa menutupi tombol aksi.
// MutationObserver menghapus HANYA toast yang berisi teks 'license'
// tanpa mengganggu error toast aplikasi lainnya.
const licenseObserver = new MutationObserver(() => {
  document.querySelectorAll('.p-toast-message').forEach((el) => {
    const text = el.textContent || ''
    if (text.toLowerCase().includes('license is not configured')) {
      el.remove()
    }
  })
})
licenseObserver.observe(document.body, { childList: true, subtree: true })
