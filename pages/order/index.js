// pages/order/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id:0,
        name:"全部",
        isActive:true
      },
      {
        id:1,
        name:"待付款",
        isActive:false
      },
      {
        id:2,
        name:"代发货",
        isActive:false
      },
      {
        id:3,
        name:"退款/退货",
        isActive:false
      }
    ]
  },
  // onShow没有options
  onShow(options){
    const token = wx.getStorageSync("token")
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    //1.获取当前小程序的页面栈-数组，最大长度10个页面
    // pages即是小程序缓存的页面
    let pages = getCurrentPages()
    // 2.pages中索引最大的就是当前页面
    let currentPage = pages[pages.length-1]
    const {type} = currentPage.options
    const {tabs} = this.data
    // type为1的时候，对应的index为0
    const index = type-1
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
    this.getOrders(type)
  },
  // 获取订单列表方法
  getOrders(type) {
    request({
      url:'/my/orders/all',
      data:{type},
      header:{Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"}
    }).then(res=>{
      const orders = res.data.message.orders.map(v=>{
        v.create_time=new Date(v.create_time*1000).toLocaleString()
        return v
      })
      // (v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      this.setData({
        orders
      })
    })
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handletabsItemChange(e) {
    const {index} = e.detail
    const {tabs} = this.data
    // 循环判断点击的索引是否和当前元素index相同
    tabs.forEach((v,i)=>{i===index?v.isActive=true:v.isActive=false})
    this.setData({
      tabs
    })
    // 点击不同按钮，根据type发送不同请求 type=index+1
    this.getOrders(index+1)
  }
})