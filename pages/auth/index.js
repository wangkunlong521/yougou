// pages/auth/index.js
import {request} from '../../request/index'
Page({
  getUserInfo(e) {
    const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    wx.setStorageSync('token', token)
    wx.navigateTo({
      url: '/pages/order/index'
    })
    // 1.获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail
    // 2.获取小程序登陆后的 code 值
    wx.login({
      timeout: 10000,
      success: (res)=>{
        const {code} = res
        // 3.获取信息后发送网络请求
        request({
          url: '/users/wxlogin',
          method:"post",
          data: {
          encryptedData,
            rawData,
            iv,
            signature,
            code},
          success: (res)=>{
            // 没有企业微信，获取不到这一步
            
          }
        })
      }
    })
    
  }
})