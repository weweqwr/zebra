// miniprogram/pages/merchantoradmin/merchant/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantCode:[],
    phone:[],
    numberid:[],
    name:[],
    merchantname: []
  },

  merchantCode:function(e){
    var that=this
    var merchantCode = e.detail.value
    that.setData({
      merchantCode: merchantCode
    })
  },
  phone:function(e){
    var that = this
    var phone= e.detail.value
    that.setData({
      phone: phone
    })
  },
  numberid:function(e){
     var that = this
     var numberid=e.detail.value
     that.setData({
       numberid: numberid
     })
  },
  name: function (e) {
    var that = this
    var name = e.detail.value
    that.setData({
      name: name
    })
  },
  merchantname: function (e) {
    var that = this
    var merchantname = e.detail.value
    that.setData({
      merchantname: merchantname
    })
  },
  submit:function(){
    var that = this
    var db=wx.cloud.database()
    var coll = db.collection('merchant')
    var merchantCode = that.data.merchantCode
    var phone = that.data.phone
    var numberid = that.data.numberid
    var userinfo = wx.getStorageSync("info")
    var name=that.data.name
    var merchantname= that.data.merchantname
    wx.showModal({
      title: '提示',
      content: '注册将会获取你的微信信息，确定吗？',
      success: function (res) {
        if (res.confirm) {
          coll.add({
            data: {
              merchantCode: merchantCode,
              phone: phone,
              numberid: numberid,
              userinfo: userinfo,
              status:"未处理",
              name:name,
              merchantname: merchantname
            },
            fail: console.error
          })
        }
        wx.showToast({
          title: '注册信息以提交，正在等待管理员通过',
          icon:'none',
        })
      }
    })
   
  }
})