// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true
      },
      {
        id: 1,
        name: "商品/商家投诉",
        isActive: false
      }
    ]
  },
  handletabsItemChange(e) {
    const {index} = e.detail
    const {tabs}= this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  }
})