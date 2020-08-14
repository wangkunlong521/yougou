// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collect:[]
  },
  onShow() {
    const collect = wx.getStorageSync('collect')
    const userinfo = wx.getStorageSync('userinfo')
    this.setData({
      userinfo,
      collect
    })

  }
})