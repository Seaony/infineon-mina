<script setup>
import { ref } from 'vue'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/auth";
import { show, verify, game } from '@/api/users'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const id = ref()
const model = ref()

const to = (url) => {
  Taro.vibrateShort()
  Taro.navigateTo({ url })
}

const onTapVerify = async () => {
  Taro.vibrateShort()
  await verify(id.value)
  Taro.showToast({ title: '验券成功', icon: 'none' })
}

const onTapGame = async () => {
  Taro.vibrateShort()
  await game(id.value)
  Taro.showToast({ title: '操作成功', icon: 'none' })
}

const fetchData = async () => {
  if (id.value) {
    model.value = await show(id.value)
  }
}

useLoad((options) => {
  id.value = options.id
  fetchData()
})

useDidShow((options) => {
  fetchData()
})
</script>

<template>
  <view class="action" v-if="model">

    <view class="action-user flex flex-items-center">
      <image class="action-user-avatar" src="/static/user/avatar.png"></image>
      <view class="flex-auto">
        <view class="action-user-name">{{ model && model.staff && model.staff.job_no ? model.staff.job_no : '未绑定' }}</view>
        <view class="action-user-tips">剩余积分：{{ model.credits }}，可用兑换券：{{ model.vouchers_count }}</view>
      </view>
    </view>

    <view class="action-grid">
      <view class="action-grid-title flex flex-items-center">
        <view class="action-grid-title-left flex-auto">操作</view>
      </view>
      <view class="action-grid-body">
        <view class="action-grid-item" v-if="user && user.ctl_winner" @tap="onTapGame">
          <image src="/static/user/action-0.png"></image>
          <view>游戏</view>
        </view>
        <view class="action-grid-item" v-if="user && user.ctl_verifier" @tap="onTapVerify">
          <image src="/static/user/action-1.png"></image>
          <view>验券</view>
        </view>
        <view class="action-grid-item" v-if="user && user.ctl_changer" @tap="to(`/pages/action/dec?id=${id}`)">
          <image src="/static/user/action-2.png"></image>
          <view>兑换</view>
        </view>
      </view>
    </view>

  </view>
</template>

<style lang="scss">
.action {
  height: 100vh;
  background: #f5f5f5;
  padding: 40px;
  &-user {
    padding: 30px;
    border-radius: 16px;
    background: #ffffff;
    &-avatar {
      width: 100px;
      height: 100px;
      margin-right: 20px;
      border-radius: 100px;
    }
    &-name {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    &-tips {
      opacity: 0.4;
      font-size: 24px;
      font-weight: 500;
    }
  }
  &-grid {
    padding: 30px;
    margin-top: 30px;
    background: #FFFFFF;
    border-radius: 16px;

    &-title {
      &-left {
        font-size: 30px;
        font-weight: 500;
      }
    }

    &-body {
      margin-top: 30px;
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(4, 1fr);
    }

    &-item {
      text-align: center;

      image {
        width: 48px;
        height: 48px;
      }

      view {
        font-size: 24px;
        font-weight: 500;
      }
    }
  }
}
</style>

