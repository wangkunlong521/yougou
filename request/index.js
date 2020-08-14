var ajaxTimes = 0;
export const request = (params)=>{
  // 如果一个页面有多个数据请求，前面的请求完了，后面的还没请求完就关闭了
  // 要做个判断
  // 请求一次++
  ajaxTimes++;
// 请求数据的时候显示请求中
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  
  return new Promise((resolve,reject)=>{
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    wx.request({
      ...params,
      url: baseUrl+params.url,
      success: (res)=>{
        resolve(res)
      },
      fail: (err)=>{
        reject(err)
      },
      // 请求完数据关闭loading
      complete: ()=>{
        // 请求完一次--
        ajaxTimes--;
        if(ajaxTimes===0){
          wx.hideLoading()
        }
      }
    }) 
  })
}