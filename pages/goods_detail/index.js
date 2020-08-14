// pages/goods_detail/index.js
import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect: false
  },
  // 当前商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    // 上个页面url传递的参数存在options中
    var data = 0
    const {goods_id} = options
    data = parseInt(goods_id)
    // console.log(data)
    this.getGoodsDetail(data)

  },
  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({
      url:`/goods/detail?goods_id=${goods_id}`,
    }).then((res)=>{
      this.GoodsInfo = res.data.message

    // 收藏功能实现
      // 1.先获取收藏数组
      let collect = wx.getStorageSync('collect')||[]
      // 2.判断当前商品是否被收藏了
      let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
      this.setData({
        isCollect,
        goodsObj:{
          // 对象里的东西不是全要，只把要的定义出来
          goods_name:  res.data.message.goods_name,
          goods_price: res.data.message.goods_price,
          // 部分ipone手机不支持webp格数图片
          // 把字符串替换成jpg
          goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics: res.data.message.pics
        }
      })
    })
  },
  // 点击轮播图放大图片
  handlePreviewImage(e) {
    const {index} = e.currentTarget.dataset
    const   urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 这个方法是点击图片放大
    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1.先获取缓存中的购物车
    // getStorageSync记录本地存储
    let cart = wx.getStorageSync('cart')||[]
    // 2.判断 商品对象是否存在于购物车
    // findIndex方法返回符合条件的对象的索引位置
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 3.判断当前商品对象是否在购物车数组里
    if(index===-1) {
      // 不存在 第一次添加
      this.GoodsInfo.num=1
      // 这个是让购物车页面商品自动勾选上，给商品添加一个属性为true
      this.GoodsInfo.checked=true
      cart.push(this.GoodsInfo)
    }else{
      // 存在 num++
      cart[index].num++
    }
    // 4.最后再把缓存放回去
    wx.setStorageSync('cart', cart)
    // 5.弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon:"success",
      // mask要为true，防止用户一直点
      mask:true
    })
  },
  // 点击商品收藏功能
  handleCollect(){

    // 1.获取收藏数组
    let collect = wx.getStorageSync('collect')||[]
    // 判断一下当前的isCollect是true还是false，判断index两个方法都可以
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 2.判断一下当前商品受否被收藏过，获取当前商品在收藏数组中的index
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 3.如果index不等于-1，就表示收藏过了,删除掉
    if(isCollect===true){
      collect.splice(index,1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      })
    }else{
      // 加入收藏
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      })
    }
    // 4.数据放进缓存中
    wx.setStorageSync('collect',collect)
    this.setData({
      isCollect
    } )
  }
})