// pages/searchs/index.js
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消的按钮是否显示
    isFocus:false
  },
  TimeId:-1,
  // 搜索框的值改变的就会触发
  handleInput(e) {
    // 1.获取输入框的值
    const {value} = e.detail
    // 2.检查合法性
    if(!value.trim()){
      this.setData({
        goods: [],
        isFocus:false,
        inpValue:""
      })
      // 不合法
     return; 
    }
    // 有值的话让取消按钮显示
    this.setData({
      isFocus:true
    })
    // 3.准备发送请求
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
  },
  // 4.发送请求，获取搜索数据
  qsearch(query) {
    request({
      url:"/goods/qsearch",
      data:{query}
    }).then(res=>{
      const goods = res.data.message
      this.setData({
        goods
      })
    })
  },
  // 点击取消按钮
  handleCancle() {
    // 清除输入框的值
    this.setData({
      inpValue:"",
      goods:[],
      isFocus:false
    })
  }
})