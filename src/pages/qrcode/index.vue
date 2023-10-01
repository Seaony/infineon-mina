<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
</script>

<template>
  <view class="qrcode">
    <view class="qrcode-inner">
      <image mode="widthFix" :src="user ? user.qrcode : ''"></image>
    </view>
  </view>
</template>

<style lang="scss">
.qrcode {
  padding: 40px;
  height: 100vh;
  background: #f5f5f5;
  &-inner {
    padding: 30px;
    border-radius: 30px;
    background: #FFFFFF;
    image {
      width: 100%;
    }
  }
}
</style>

