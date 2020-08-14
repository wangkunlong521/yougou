// pages/goods_list/index.js
import {request} from "../../request/index"
Page({

  data: {
    tabs: [
      {
        id: 0,
        name: "综合",
        isActive: true
      },
      {
        id: 1,
        name: "销量",
        isActive: false
      },
      {
        id: 2,
        name: "价格",
        isActive: false
      }
    ],
    goodslist: []
  },
  QueryParams: {
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||""
    this.QueryParams.query = options.query||""
    this.getGoodsList()
  },

  // 获取商品列表数据
  getGoodsList() {
    request({
      url:"/goods/search"
    }).then(res=>{
      // console.log(res.data.message.total)
      // 获取总条数
      const total = res.data.message.total
      // 计算总页数
      this.totalPages = Math.ceil(23/this.QueryParams.pagesize)
      // console.log(this.totalPages)
      this.setData({
        // 数组拼接
        goodslist: [...this.data.goodslist,...res.data.message.goods]

      })
    })
    // 数据请求完后关闭下拉刷新
    wx.stopPullDownRefresh()
  },
  handletabsItemChange(e) {
    const {index} = e.detail
    const {tabs} = this.data
    // 循环判断点击的索引是否和当前元素index相同
    tabs.forEach((v,i)=>{i===index?v.isActive=true:v.isActive=false})
    this.setData({
      tabs
    })
  },
  // 页面到底后加载下一页
  // 先判断是否有下一页，有的话加载，没有的话弹出话
  // 知道当前页数
  // 知道总页数就能判断是否到底了
  // 假如还有下一页：
  //   1.当前页面++
  //   2.重新发送请求
  //   3.请求出来的数据 要和上一页数据进行数组拼接  而不是替换！！！
  onReachBottom() {
    if(this.QueryParams.pagenum>=this.totalPages) {
      wx.showToast({
        title: '没有下一页数据了'
      })
    }else{
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  //  下拉刷新事件
      // 1 触发下拉刷新 json中配置
          // --找到下拉刷新的事件
      // 2 重置数据
      // 3 重置页码 
  onPullDownRefresh() {
    // 数组重置
    this.setData({
      goodslist: []
    })
    // 页码重置
    this.QueryParams.pagenum= 1
    // 重新发送请求
    this.getGoodsList()
  }
  
})
