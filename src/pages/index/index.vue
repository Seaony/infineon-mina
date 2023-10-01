<script setup>
import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useAuthStore } from "@/stores/auth";
import { checkin } from '@/api/user'

const statusbar = ref(Taro.getSystemInfoSync().statusBarHeight)

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const to = url => {
  Taro.vibrateShort()
  Taro.navigateTo({ url })
}

useDidShow(() => {
  if (user.value && !user.value.staff_id) {
    Taro.redirectTo({ url: '/pages/bind/index' })
  }
})

const onTapCheckin = async () => {
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
        title: '提示', content: '获取位置失败，请打开定位权限', success: () => {
          Taro.openSetting()
        }
      })
    },
  })
}
</script>

<template>
  <view class="index" :style="{ paddingTop: `${statusbar}px` }" v-if="user">
    <view class="index-bar">个人中心</view>
    <view class="index-bg"></view>
    <view class="index-info">
      <image class="index-info-avatar" src="/static/user/avatar.png"></image>
      <view class="index-info-name">{{ user && user.staff && user.staff.job_no ? user.staff.job_no : '未绑定' }}</view>
      <view class="index-info-tips">加油～奥里给～</view>
    </view>
    <view class="index-wrap">
      <view class="index-sign flex flex-items-center">
        <view class="index-sign-tips flex-auto">到达活动现场，完成签到有礼品哦</view>
        <button class="index-sign-btn" :class="{ dis: user && user.is_checkin }" @tap="onTapCheckin">{{ user ? (user.is_checkin ? '已签到' : '立即签到') : '立即签到' }}</button>
      </view>
      <view class="index-my">
        <view class="index-my-title flex flex-items-center">
          <view class="index-my-title-left flex-auto">我的积分</view>
          <image class="index-my-title-right" @tap="to(`/pages/game/index`)" mode="heightFix" src="/static/user/cre.png"></image>
        </view>
        <view class="index-my-body">
          <view class="index-my-item" @tap="to(`/pages/game/index`)">
            <view>
              <text>{{ user ? user.credits : 0 }}</text>
            </view>
            <image src="/static/user/icon-1.png"></image>
          </view>
          <view class="index-my-item" @tap="to(`/pages/qrcode/index`)">
            <view>积分兑换</view>
            <image src="/static/user/icon-2.png"></image>
          </view>
        </view>
      </view>
      <view class="index-action">
        <view class="index-action-title flex flex-items-center">
          <view class="index-action-title-left flex-auto">其他服务</view>
        </view>
        <view class="index-action-body">
          <view class="index-action-item">
            <image src="/static/user/action-0.png"></image>
            <view>照片直播</view>
          </view>
          <view class="index-action-item" @tap="to(`/pages/vouchers/index`)">
            <image src="/static/user/action-1.png"></image>
            <view>美食券</view>
          </view>
          <view class="index-action-item" @tap="to(`/pages/qrcode/index`)">
            <image src="/static/user/action-2.png"></image>
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
        height: 36px;
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
