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
  if (!model.value.is_checkin) {
    return Taro.showToast({ title: '此用户还未签到，请先签到', icon: 'none' })
  }
  Taro.vibrateShort()
  Taro.navigateTo({ url })
}

const onTapVerify = async () => {
  if (!model.value.is_checkin) {
    return Taro.showToast({ title: '此用户还未签到，请先签到', icon: 'none' })
  }
  Taro.vibrateShort()
  Taro.showModal({
    title: '提示', content: '确定要核验一张优惠券吗？', success: async (res) => {
      if (res.confirm) {
        await verify(id.value)
        Taro.showToast({ title: '验券成功', icon: 'none' })
      }
    }
  })

}

const onTapGame = async () => {
  if (!model.value.is_checkin) {
    return Taro.showToast({ title: '此用户还未签到，请先签到', icon: 'none' })
  }
  Taro.vibrateShort()
  Taro.showModal({
    title: '提示', content: '确定要增加用户的游戏积分吗？', success: async (res) => {
      if (res.confirm) {
        await game(id.value)
        Taro.showToast({ title: '操作成功', icon: 'none' })
      }
    }
  })
}

const fetchData = async () => {
  if (id.value) {
    model.value = await show(id.value, { include: 'credit_logs' })
  }
}

useLoad((options) => {
  id.value = options.id
  fetchData()
})

useDidShow((options) => {
  if (id.value) {
    fetchData()
  }
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
          <image src="/static/icons/live.png"></image>
          <view>{{ user.game.name || '游戏' }}</view>
        </view>
        <view class="action-grid-item" v-if="user && user.ctl_verifier" @tap="onTapVerify">
          <image src="/static/icons/voucher.png"></image>
          <view>验券</view>
        </view>
        <view class="action-grid-item" v-if="user && user.ctl_changer" @tap="to(`/pages/action/dec?id=${id}`)">
          <image src="/static/icons/qrcode.png"></image>
          <view>兑换</view>
        </view>
      </view>
    </view>

    <view class="action-logs">
      <view class="action-logs-body">
        <view v-for="(credit_log, key) in model.credit_logs" :key="key" class="action-logs-item flex flex-items-center">
          <view class="flex-auto">
            <view class="action-logs-item-title">{{ credit_log.message }}</view>
            <view class="action-logs-item-subtitle">{{ credit_log.created_at }}</view>
          </view>
          <view class="action-logs-item-value" :class="{ sec: credit_log.credits > 0, dec: credit_log.credits <= 0 }">{{ credit_log.credits > 0 ? `+${credit_log.credits}` : credit_log.credits }}</view>
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
  &-logs {
    padding: 30px;
    margin-top: 30px;
    background: #FFFFFF;
    border-radius: 16px;

    &-item {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px dashed #eee;
      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      &-title {
        font-size: 26px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      &-subtitle {
        opacity: 0.4;
        font-size: 22px;
      }
      &-value {
        font-size: 28px;
        font-weight: bold;
        &.sec {
          color: #6A9C89;
        }
        &.dec {
          color: #CD5C08;
        }
      }
    }

  }
}
</style>

