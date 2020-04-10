// miniprogram/pages/merchantoradmin/admin/adminAd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  onShow:function(){
    var that=this 
    that.show();
  },
  //展示
  show:function(){
    const db = wx.cloud.database()

    // 查询当前货物所有的 
    db.collection('goods').where({
      show: "1"
    }).get({
      success: res => {
        var arr=res.data   
        for(var i in arr){
          if(arr[i].show=="1"){
            arr[i].flag="true"
          }else{
            arr[i].flag = ""
          }
        } 
        this.setData({ imgUrls: arr })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    db.collection('goods').where({
      
    }).get({
      success: res => {
        var arr = res.data
        for (var i in arr) {
          if (arr[i].show == "1") {
            arr[i].flag = "true"
          } else {
            arr[i].flag = ""
          }
        }
        this.setData({ imgUrls2: arr })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //修改照片展示栏目
  showorno:function(e){
    var that = this
    var id=e.currentTarget.dataset.id
    var db=wx.cloud.database()
    var coll=db.collection("goods")
    var flag = e.detail.value
    wx.cloud.callFunction({
      name:"adminupdata",
      data:{
        id:id,
        flag:flag
      },
      success:function (){
        that.show()
      },
      flag:console.error
    })
    that.show();
  }
 

})