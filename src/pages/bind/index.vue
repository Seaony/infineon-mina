<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { bind } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const mobile = ref('')
const job_no = ref('')

const onTapLogin = async () => {
  if (!mobile.value) {
    return Taro.showToast({ title: '请填写手机号', icon: 'none' })
  }
  if (!job_no.value) {
    return Taro.showToast({ title: '请填写工号', icon: 'none' })
  }
  await bind({ mobile: mobile.value, job_no: job_no.value })
  await authStore.refresh()
  Taro.showToast({ title: '绑定成功', icon: 'none' })
  Taro.redirectTo({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="bind-index">
    <image class="bind-index-bg" mode="aspectFill" src="/static/bind/bg.png"></image>
    <view class="bind-index-form">
      <view class="bind-index-form-item">
        <view class="bind-index-form-item-title">手机号</view>
        <view class="bind-index-form-item-inner flex flex-items-center">
          <image src="/static/bind/user.png"></image>
          <input class="flex-auto" v-model="mobile" type="number">
        </view>
      </view>
      <view class="bind-index-form-item">
        <view class="bind-index-form-item-title">工号</view>
        <view class="bind-index-form-item-inner flex flex-items-center">
          <image src="/static/bind/password.png"></image>
          <input class="flex-auto" v-model="job_no" type="text">
        </view>
      </view>
      <button class="bind-index-form-btn" @tap="onTapLogin">登录</button>
    </view>
  </view>
</template>

<style lang="scss">
.bind-index {
  &-bg {
    width: 100%;
    height: 560px;
  }
  &-form {
    z-index: 1;
    padding: 80px 30px 30px;
    margin-top: -40px;
    background: #ffffff;
    position: relative;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    &-item {
      padding: 24px;
      position: relative;
      border-radius: 30px;
      margin-bottom: 40px;
      border: 1px solid #aaa7a7;
      &-title {
        top: 0;
        left: 40px;
        font-size: 26px;
        padding: 8px 32px;
        font-weight: 500;
        position: absolute;
        background: #ffffff;
        color: rgba(0, 0, 0, 0.7);
        transform: translateY(-50%);
      }
      &-inner {
        padding-top: 8px;
        image {
          width: 64px;
          height: 64px;
        }
        input {
          margin-left: 20px;
        }
      }
    }
    &-btn {
      color: #ffffff;
      font-size: 32px;
      padding: 20px 0;
      font-weight: bold;
      margin-top: 80px;
      background: #3A8076;
      border-radius: 30px;
    }
  }
}
</style>
