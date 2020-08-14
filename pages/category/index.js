// pages/category/index.js
import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent: [],
    currentIndex:0,
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.先判断一下本地储存中有没有旧的数据
        // {time:Date.now(),data:[...]}
    // 2.没有旧的数据直接放新请求
    // 3.有旧的数据就用旧的数据
    
    // web端本地储存和小程序的差别
        // 1.web端存：localStorage.setItem("key",{})
        //   web端取：localStorage.getItem("key")
        // 2.小程序存： wx.setStorageSync('key',{})
        //   小程序取： wx.getStorageSync('key')  

    // 1.获取本地数据
    const Cates = wx.getStorageSync('cates')
    // 2.判断
    if(!Cates) {
      this.getCates()
    }else{
      //有旧的数据 判断是否过期，自己定义过期时间
      if(Date.now()-Cates.time>1000*10){
        this.getCates()
      }else{
        this.Cates = Cates.data
        const leftMenuList = this.Cates.map(v=>v.cat_name)
        const rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类数据
  getCates(){
    request({
      url: '/categories'
    }).then((res)=>{
      this.Cates = res.data.message
      // 把获取的数据存到本地
      wx.setStorageSync('cates',{
        time:Date.now(),
        data:this.Cates
      })

      const leftMenuList = this.Cates.map(v=>v.cat_name)
      const rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  },
  handleItemTap(e){
    // 1.获取被点击的标题身上的索引
    // 2.给data中的currentIndex赋值就可以了
    // 3.根据不同的索引来渲染右侧的商品内容
    console.log(e)
    const {index} = e.currentTarget.dataset
    const rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})

