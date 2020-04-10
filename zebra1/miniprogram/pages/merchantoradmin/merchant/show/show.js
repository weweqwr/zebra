// miniprogram/pages/merchantoradmin/merchant/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow:function(){
    var that=this
    that.show()
  },
  //展示
  show: function () {
    const db = wx.cloud.database()
    var userinfo=wx.getStorageSync('info')

    // 查询当前货物所有的 
    db.collection('goods').where({
      userinfo:userinfo
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
  },
  del:function(e){
    var that=this
    var id = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name:"delgoods",
      data:{
        id:id
      },
      success:function(res){
        console.log(res.result)
        wx.showToast({
          title: '货物以删除',
          icon:"none"
        })
        that.show()
      },
      fail:console.error
    })
  },
  
  update:function(e){
    var id = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: "/pages/merchantoradmin/merchant/update/update?id=" + id,
    })
  },
  add:function(e){
    wx.navigateTo({
      url: "/pages/merchantoradmin/merchant/add/add",
    })
  }

})