// pages/cart/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[]
    // 支付的商品是checked为true的
    cart = cart.filter(v=>v.checked)
    this.setData({
      address
    })
    this.setCart(cart)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 上面重新计算总价格的代码要重复用，封装一下
  setCart(cart) {
    let totalPrice=0
    let totalNum=0
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price
        totalNum+=v.num
    })
    this.setData({
      totalPrice,
      totalNum,
      cart
    })
  },
  // 点击支付功能
  handleOrderPay() {
    // 1.判断缓存中有没有token
    const token = wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    // 创建订单
    // 1.准备请求头参数
    const header={Authorization:token}
    // 2.请求体参数
    const order_price = this.data.totalPrice
    // 3.收货地址
    const consignee_addr = this.data.address.all
    const cart = this.data.cart
    let goods= []
    cart.forEach(v=>{
      goods.push({
        goods_id:v.goods_id,
        goods_number: v.num,
        goods_price:v.goods_price
      })
    })
    // 4.准备发送请求，获取订单编号
    request({
      url:'/my/orders/create',
      method: 'post',
      order_price,
      consignee_addr,
      goods,
      header,
      success:(res)=>{

      }
    })
    // 微信支付完成后，手动删除支付后的商品
    let newCart = wx.getStorageSync('cart')
    // 留下来未被选中的商品
    newCart = newCart.filter(v=>!v.checked)
    wx.setStorageSync('cart', newCart)
  }
})