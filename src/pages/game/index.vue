<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { storeToRefs } from 'pinia'
import { useLoad } from '@tarojs/taro'
import { useAuthStore } from "@/stores/auth";
import { index as apiIndex } from '@/api/game'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const ratio = ref(Taro.getSystemInfoSync().windowWidth/860)
const models = ref([])
const showModal = ref(false)
const currentModal = ref(null)

const fetchData = async () => {
  models.value = await apiIndex()
}

const onTapModal = (model) => {
  Taro.vibrateShort()
  currentModal.value = model
  showModal.value = true
}

useLoad(() => {
  fetchData()
})
</script>

<template>
  <view class="game">
    <view class="game-inner">
      <image class="game-bg" src="/static/game/bg.png" mode="widthFix"></image>
      <view class="game-item" v-for="model in models" :key="model.id" :style="{
        top: `${model.top * ratio}px`,
        left: `${model.left * ratio}px`,
        width: `${model.width * ratio}px`,
        height: `${model.height * ratio}px`,
       }" @tap="onTapModal(model)"></view>
    </view>
  </view>

  <view class="modal-mask" :class="{ visiable: showModal }" @tap="showModal = false"></view>
  <view class="modal-inner" :class="{ visiable: showModal }" @tap="showModal = false">
    <view class="modal-inner-name">{{ currentModal ? currentModal.name : '' }}</view>
    <view class="modal-inner-text">{{ currentModal ? currentModal.rule : '' }}</view>
    <image class="modal-inner-bg" src="/static/game/rule.png"></image>
  </view>
</template>

<style lang="scss">
.game {
  &-inner {
    position: relative;
  }
  &-bg {
    width: 100%;
    position: relative;
    vertical-align: middle;
  }
  &-item {
    position: absolute;
  }
}
.modal {
  &-mask {
    top: 0;
    left: 0;
    opacity: 0;
    visibility: hidden;
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.2);
    transition: ease all .3s;
    &.visiable {
      opacity: 1;
      visibility: visible;
    }
  }
  &-inner {
    top: 50%;
    left: 50%;
    opacity: 0;
    visibility: hidden;
    width: 570px;
    height: 906px;
    position: fixed;
    transition: ease all .3s;
    transform: translateX(-50%) translateY(-50%);
    &.visiable {
      opacity: 1;
      visibility: visible;
    }
    &-bg {
      width: 100%;
      height: 100%;
    }
    &-name {
      top: 160px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 80px;
      color: #FFFFFF;
      font-size: 34px;
      font-weight: 500;
      line-height: 1.5;
      text-align: center;
      position: absolute;
    }
    &-text {
      top: 240px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 80px;
      color: #FFFFFF;
      font-size: 28px;
      line-height: 1.5;
      text-align: center;
      position: absolute;
    }
  }
}
</style>

