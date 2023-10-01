// https://pinia.esm.dev/introduction.html
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/api/auth'
import { profile as apiProfile } from '@/api/user'

export const useAuthStore = defineStore('auth', () => {

  // 用户信息 默认: Null
  const user = ref(null)

  // 用户是否已登录 默认: False
  const isAuthenticated = ref(false)

  /**
   * 登录用户
   *
   * @param data 用户信息
   */
  const attempt = data => {
    user.value = data
    isAuthenticated.value = true
  }

  const login = async () => {
    const { code } = await Taro.login()
    const { token } = await apiLogin({ code: code })
    Taro.setStorageSync('token', token)
  }

  const refresh = async () => {
    attempt(await apiProfile())
  }

  return { user, isAuthenticated, attempt, login, refresh }
})
