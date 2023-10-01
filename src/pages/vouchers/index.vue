<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useLoad } from '@tarojs/taro'
import { useAuthStore } from "@/stores/auth";
import { vouchers as apiIndex } from '@/api/user'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const models = ref([])

const fetchData = async () => {
  models.value = await apiIndex()
}

const to = url => {
  Taro.vibrateShort()
  Taro.navigateTo({ url })
}

useLoad(() => {
  fetchData()
})
</script>

<template>
  <view class="voucher">
    <view class="voucher-item" v-for="model in models" :key="model.id" @tap="to(`/pages/qrcode/index`)">
      <image mode="widthFix" src="/static/vouchers/bg.png"></image>
    </view>
  </view>
</template>

<style lang="scss">
.voucher {
  padding: 40px;
  &-inner {
    position: relative;
  }
  &-item {
    margin-bottom: 20px;
    image {
      width: 100%;
    }
  }
}
</style>

