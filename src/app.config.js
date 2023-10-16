export default {
  pages: [
    'pages/index/index',
    'pages/action/index',
    'pages/live/index',
    'pages/vouchers/index',
    'pages/action/dec',
    'pages/game/index',
    'pages/qrcode/index',
    'pages/bind/index',
  ],
  permission: {
    "scope.userLocation": {
      "desc": "用于活动地点打卡"
    }
  },
  requiredPrivateInfos: ['getLocation'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
