<script setup>
import { ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/auth";
import { credits } from '@/api/users'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const id = ref(null)
const total = ref(5)

const onTapConfirm = async () => {
  Taro.vibrateShort()
  if (total.value <= 0) {
    return Taro.showToast({ title: '请输入扣除积分数量', icon: 'none' })
  }

  await credits(id.value, { total: total.value })
  Taro.showToast({ title: '扣除成功', icon: 'none' })
  setTimeout(() => {
    Taro.navigateBack()
  }, 1000)
}

useLoad((options) => {
  id.value = options.id
})
</script>

<template>
  <view class="dec">
    <input class="dec-inner" type="number" v-model="total" placeholder="请输入扣除积分数量">
    <button class="dec-btn" @tap="onTapConfirm">确定扣除</button>
  </view>
</template>

<style lang="scss">
.dec {
  height: 100vh;
  padding: 40px;
  &-inner {
    font-size: 26px;
    font-weight: 500;
    padding: 20px 32px;
    background: #f5f5f5;
    border-radius: 16px;
  }
  &-btn {
    color: #FFFFFF;
    margin-top: 40px;
    background: #3A8076;
  }
}
</style>

