//index.js
//获取应用实例
// 引入数据请求
import {request} from "../../request/index"
const app = getApp()

Page({
  data: {
    // 轮播图数组
    swiperlist: [],
    // 导航数组
    cateslist:[],
    // 楼层数组
    floorlist: [],
    text: []
  },
  
  onLoad: function () {
    // wx.request({
    //   url:"/home/swiperdata",
    //   success: (res)=>{
    //     console.log(res)
    //     this.setData({
    //       swiperlist: res.data.message
    //     })
    //   }
    // })
    this.getSwiperList()
    this.getCatesList()
    this.getfloorlist()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: "/home/swiperdata"
    }).then(res=>{
      const swiperlist = res.data.message
      this.setData({
        swiperlist
      })
    })
  },
  // 获取分类导航数据
  getCatesList() {
    request({
      url: "/home/catitems"
    }).then(res=>{
      this.setData({
        cateslist: res.data.message
      })
    })
  },
  // 获取楼层数据
  getfloorlist() {
    request({
      url: "/home/floordata"
    }).then(res=>{
      const floorlist= res.data.message
      this.setData({
        floorlist
      })
    })
  }
})
