import Taro from '@tarojs/taro'
import { domain, accept } from '@/env.js'

class Request {
  get (url, data) {
    return this.request(url, 'GET', data)
  }

  post (url, data) {
    return this.request(url, 'POST', data)
  }

  put (url, data) {
    return this.request(url, 'PUT', data)
  }

  delete (url, data) {
    return this.request(url, 'DELETE', data)
  }

  upload (url, filePath, prefix) {
    return new Promise((resolve, reject) => {
      Taro.uploadFile({
        url: domain + url,
        name: 'file',
        formData: {
          prefix
        },
        filePath: filePath, // 微信本地文件，通过选择图片，聊天文件等接口获取
        header: {
          Accept: accept,
          Authorization: Taro.getStorageSync('token'),
        },
        success: res => {
          resolve(JSON.parse(res.data))
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

  request(url, method, data = {}) {
    const options = {
      url: domain + url,
      data,
      method,
      timeout: 60000,
      header: {
        Accept: accept,
        Authorization: Taro.getStorageSync('token'),
      }
    }

    return new Promise((resolve, reject) => {

      let requester = Taro.request(options)

      requester.then(res => {
        if (res.statusCode >= 400 && res.data.message) {
          Taro.showToast({ title: res.data.message, icon: 'none' })
          return reject(res)
        }
        resolve(res.data)
      })
    })
  }
}

export default new Request()
