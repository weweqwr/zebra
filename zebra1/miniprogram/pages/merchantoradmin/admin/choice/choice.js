// miniprogram/pages/merchantoradmin/choice/choice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //广告管理
  merchant: function (e) {
    wx.navigateTo({
      url: "/pages/merchantoradmin/admin/ad/adminAd",
    })
   
  }
,//店家管理
  admin:function(e){
    wx.navigateTo({
      url: "/pages/merchantoradmin/admin/merequest/merequest",
    })
  }
})