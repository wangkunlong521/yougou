// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked:false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[]
    // 计算购物车全选,全选的话allChecked为true，下面的全选就会勾选
    // cart数组为空的时候，every返回的就是true
    // const allChecked = cart.length?cart.every(v=>v.checked):false
    // 定义总价和总数量，再循环cart数组，被选中的就总totalPrice+=
    // let allChecked=true
    // let totalPrice=0
    // let totalNum=0
    // cart.forEach(v=>{
    //   if(v.checked) {
    //     totalPrice+=v.num*v.goods_price
    //     totalNum+=v.num
    //   }else{
    //     allChecked=false
    //   }
    // })
    // // 要是cart为空的话if不执行，allChecked就为true了，所以要做个判断
    // allChecked = cart.length!=0?allChecked:false
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
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
  // 点击收货地址按钮
  handleChooseAddress() {
    // 获取收获地址权限状态
    wx.getSetting({
      // 获取权限状态，有权限的话这个方法返回一个scope.address: true
      success: (result)=>{
        // scope.address有个点，所以不能在后面直接.了，要用中括号
        const scopeAddress = result.authSetting["scope.address"]
        if(scopeAddress===true||scopeAddress===undefined){
          // 获取地址
          wx.chooseAddress({
            success: (address) => {
              // 把获取的地址存入到缓存中
              wx.setStorageSync('address', address)
            }
          })
        }else{
          // 用户以前拒绝过权限 诱导用户打开权限
          wx.openSetting({
            success: (result2)=>{
              // 诱导之后  就可以再获取收获地址
              wx.chooseAddress({
                success: (address) => {
                  wx.setStorageSync('address', address)
                }
              })
            }
          })
        }
      }
    })
  },
  // 商品被选中状态发生改变的事件
  handleItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 2.获取购物车数组
    let {cart} = this.data
    // 3.找到被修改的商品对象索引
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    // 4.对商品的checked状态取反
    cart[index].checked=!cart[index].checked
    // // 5.6.把cart重新放回去,缓存中的数据也要重新放
    // this.setData({
    //   cart
    // })
    // wx.setStorageSync('cart', cart)
    // // 由于被选中的商品发生改变，重新计算总价格
    // let allChecked=true
    // let totalPrice=0
    // let totalNum=0
    // cart.forEach(v=>{
    //   if(v.checked) {
    //     totalPrice+=v.num*v.goods_price
    //     totalNum+=v.num
    //   }else{
    //     allChecked=false
    //   }
    // })
    // // 要是cart为空的话if不执行，allChecked就为true了，所以要做个判断
    // allChecked = cart.length!=0?allChecked:false
    // this.setData({
    //   totalPrice,
    //   totalNum
    // })
    this.setCart(cart)
  },
  // 上面重新计算总价格的代码要重复用，封装一下
  setCart(cart) {
    let allChecked=true
    let totalPrice=0
    let totalNum=0
    cart.forEach(v=>{
      if(v.checked) {
        totalPrice+=v.num*v.goods_price
        totalNum+=v.num
      }else{
        allChecked=false
      }
    })
    // 要是cart为空的话if不执行，allChecked就为true了，所以要做个判断
    allChecked = cart.length!=0?allChecked:false
    this.setData({
      totalPrice,
      totalNum,
      allChecked,
      cart
    })
    wx.setStorageSync('cart', cart)
  },
  // 按全选按钮商品被选中状态发生改变
  handleAllChange() {
  //  获取cart和allChecked
    let {cart,allChecked} = this.data
    // 修改allChecked
    allChecked=!allChecked
    // 让每一个商品的 checked 属性值跟随 allChecked
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },
  // 商品-  +按钮的点击
  handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset
    // 2.获取cart
    let {cart}=this.data
    // 3.找到被点击的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id)
    // 修改数量之前判断是否数量为0
    if(cart[index].num===1&&operation===-1){
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除该商品',
        success :(res)=> {
          if (res.confirm) {
            cart.splice(index,1)
            this.setCart(cart)
          } else if (res.cancel) {
          }
        }
      })
    }else{
      // 4.进行修改数量
      cart[index].num+=operation
      // 5.数据怼回去
      this.setCart(cart)
    }
  },
  // 点击结算按钮
  handlePay() {
    // 1.判断是否有收货地址
    const {address,totalNum} = this.data
    if(!address.userName) {
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:'none'
      })
      return;
    }
    // 2.判断购物车有没有商品
    if(totalNum===0){
      wx.showToast({
        title: '您的购物车还没有商品',
        icon:'none'
      })
      return;
    }
    // 地址和购物车都有的话跳转到支付页面
    wx-wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})