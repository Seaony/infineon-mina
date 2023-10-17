<script setup>
import { ref } from 'vue'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/auth";
import { checkin, live } from '@/api/user'

const statusbar = ref(Taro.getSystemInfoSync().statusBarHeight)

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const to = (url, mustCheckIn = true) => {
  Taro.vibrateShort()
  Taro.navigateTo({ url })
}

const onTapBind = () => {
  Taro.vibrateShort()
  if (user.value && !user.value.staff_id) {
    Taro.navigateTo({ url: '/pages/bind/index' })
  }
}

const toLive = async () => {
  Taro.vibrateShort()
  if (true) {
    Taro.navigateTo({ url: '/pages/live/index' })
  }
  // const data = await live()
  // Taro.navigateToMiniProgram(data)
}

useDidShow(() => {
  if (user.value && !user.value.staff_id) {
    Taro.redirectTo({ url: '/pages/bind/index' })
  }
})

const onTapCheckin = async () => {
  Taro.showModal({
    title: '安全提醒',
    content: '进入会场后请遵守安全规则！此活动已根据报名时所填信息购买保险，如因本人提供错误信息导致保险购买失败，后果自行负责。',
    success (res) {
      if (res.confirm) {
        Taro.showLoading()
        Taro.getLocation({
          success: async e => {
            await checkin(e)
            await authStore.refresh()
            Taro.hideLoading()
            Taro.showToast({ title: '签到成功', icon: 'none' })
          },
          fail: (e) => {
            Taro.hideLoading()
            Taro.showModal({
              title: '提示', content: '需现场签到，请打开定位权限', success: () => {
                Taro.openSetting()
              }
            })
          },
        })
      }
    }
  })
}

useShareAppMessage(() => {
  return {
    title: '数字森凌家庭日',
    path: '/pages/index/index',
    imageUrl: 'http://fawn-1305396618.cos.ap-nanjing.myqcloud.com/w3y2Nj0oiggZSedSsD6tfLbg3gupiefPe1MnN94Z.png',
  }
})
</script>

<template>
  <view class="index" :style="{ paddingTop: `${statusbar}px` }" v-if="user">
    <view class="index-bar">个人中心</view>
    <view class="index-bg"></view>
    <view class="index-info" @tap="onTapBind">
      <image class="index-info-avatar" src="/static/user/avatar.png"></image>
      <view class="index-info-name">{{ user && user.staff && user.staff.job_no ? user.staff.job_no : '未绑定' }}</view>
      <view class="index-info-tips">数字低碳  共创未来</view>
    </view>
    <view class="index-wrap">
      <view class="index-sign flex flex-items-center">
        <view class="index-sign-tips flex-auto">到达活动现场，完成签到有礼品哦</view>
        <button class="index-sign-btn" :class="{ dis: user && user.is_checkin }" @tap="onTapCheckin">{{ user ? (user.is_checkin ? '已签到' : '立即签到') : '立即签到' }}</button>
      </view>
      <view class="index-my">
        <view class="index-my-title flex flex-items-center">
          <view class="index-my-title-left flex-auto">我的积分</view>
          <view class="index-my-title-right" @tap="to(`/pages/qrcode/index`)">
            <text>积分兑换 (仅能兑换一次)</text>
            <image src="/static/icons/chevron-right.svg"></image>
          </view>
        </view>
        <view class="index-my-body">
          <view class="index-my-item" @tap="to(`/pages/game/index`, false)">
            <view>
              <text>{{ user ? user.credits : 0 }}</text>
            </view>
            <image src="/static/user/icon-1.png"></image>
          </view>
          <view class="index-my-item" @tap="to(`/pages/game/index`, false)">
            <view style="line-height: 1;margin-top: 28px;">
              <view style="line-height: 1;margin-bottom: 8px;">赢游戏</view>
              <view style="line-height: 1;">赚积分</view>
            </view>
            <image src="/static/user/icon-2.png"></image>
          </view>
        </view>
      </view>
      <view class="index-action">
        <view class="index-action-title flex flex-items-center">
          <view class="index-action-title-left flex-auto">其他服务</view>
        </view>
        <view class="index-action-body">
          <view class="index-action-item" @tap="toLive">
            <image src="/static/icons/live.png"></image>
            <view>照片直播</view>
          </view>
          <view class="index-action-item" @tap="to(`/pages/vouchers/index`)">
            <image src="/static/icons/voucher.png"></image>
            <view>美食券</view>
          </view>
          <view class="index-action-item" @tap="to(`/pages/qrcode/index`)">
            <image src="/static/icons/qrcode.png"></image>
            <view>个人码</view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="index-loading" v-else>加载中</view>
</template>

<style lang="scss">
.index {
  height: 100vh;
  background: #f5f5f5;
  position: relative;

  &-bar {
    height: 88px;
    z-index: 10;
    font-size: 34px;
    font-weight: 500;
    line-height: 88px;
    text-align: center;
    position: relative;
  }

  &-bg {
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    position: absolute;
    background: linear-gradient(to bottom, #AECDCA, #f5f5f5);
  }

  &-info {
    z-index: 1;
    padding: 30px;
    position: relative;
    text-align: center;

    &-avatar {
      width: 140px;
      height: 140px;
      margin-bottom: 20px;
      border-radius: 100px;
      vertical-align: middle;
    }

    &-name {
      font-size: 34px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    &-tips {
      opacity: 0.4;
      font-size: 26px;
      font-weight: 500;
    }
  }

  &-wrap {
    z-index: 10;
    padding: 0 60px;
    margin-top: 30px;
    position: relative;
  }

  &-sign {
    padding: 30px;
    background: url("http://fawn-1305396618.cos.ap-nanjing.myqcloud.com/zdTlMNtzzRsYeXndy3qEizmGwJWSgCiu0Lt2zf48.png");
    background-size: 100% 100%;

    &-tips {
      color: #DDC481;
      font-size: 26px;
    }

    &-btn {
      color: #000;
      font-size: 26px;
      padding: 0px 16px;
      border-radius: 50px;
      background: #F4E082;

      &.dis {
        color: #FFFFFF;
        background: #A6A6A6;
      }
    }
  }

  &-my {
    padding: 30px;
    margin-top: 30px;
    background: #FFFFFF;
    border-radius: 16px;

    &-title {
      &-left {
        font-size: 30px;
        font-weight: 500;
      }

      &-right {
        font-size: 24px;
        color: #3F68B7;
        image {
          width: 24px;
          height: 24px;
          vertical-align: -2px;
          margin-left: 4px;
        }
      }
    }

    &-body {
      margin-top: 30px;
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: repeat(2, 1fr);
    }

    &-item {
      height: 170px;
      border-radius: 16px;
      background: #FAFAFE;
      position: relative;

      image {
        right: 0;
        bottom: 0;
        width: 82px;
        height: 58px;
        position: absolute;
      }

      view {
        font-size: 30px;
        padding-left: 20px;
        line-height: 170px;

        text {
          font-size: 40px;
        }
      }
    }
  }

  &-action {
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

  &-loading {
    padding: 80px;
    text-align: center;
    opacity: 0.4;
  }
}
</style>

