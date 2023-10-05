import Taro from '@tarojs/taro'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'


import './app.scss'

const App = createApp({
  async onLaunch(options) {
    const authStore = useAuthStore()
    await authStore.login()
    await authStore.refresh()
    if (authStore.user && !authStore.user.staff_id) {
      Taro.redirectTo({ url: '/pages/bind/index' })
    }
  },
  async onShow(options) {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      await authStore.refresh()
    }
  }
})

App.use(createPinia())

export default App
