// miniprogram/pages/address/defaultaddress/defaultaddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[]
  },//跳转到新增地址界面
   addAddress:function (){
     wx.navigateTo({
       url: '/pages/address/newaddress/newaddress',
     })
  },
  onShow:function(){
    var that = this
    that.show()
  },
  delAddress: function (e) {
    var that = this
    var addressinfo = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: "deladdress",
      data: {
        addressinfo: addressinfo
      },
      success: function (res) {
        console.log(res.result)
        that.show()
      }
    })

  }
  ,
  show:function (){
    var that = this
    var db = wx.cloud.database()
    var coll = db.collection('address')
    var userinfo = wx.getStorageSync("info")
    console.log(userinfo)
    var address = []
    coll.where({ userinfo: userinfo }).get({
      success: res => {
        address = res.data
        that.setData({ address: address[0].addressinfo })
      },
      fail: err => {
        wx.showToast({
          title: '获取地址失败',
        })
      }
    }
    )
  },
  
  

  
})