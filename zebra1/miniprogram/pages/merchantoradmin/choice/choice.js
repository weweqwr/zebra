// miniprogram/pages/merchantoradmin/choice/choice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //验证商家
  merchant: function (e) {
    var db = wx.cloud.database()
    var coll = db.collection("merchant")
    var userinfo = wx.getStorageSync("info")
    coll.where({ userinfo: userinfo,status:"接受"}).get({
      success:res=>{
        var merchantinfo=res.data
        console.log(merchantinfo)
        if(merchantinfo.length!=0){
          
          console.log("跳转到商家管理页面")
          wx.navigateTo({
            url: '/pages/merchantoradmin/merchant/show/show',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '对不起，您不是商家，马上注册？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/merchantoradmin/merchant/register/register",
                })
              }
            }
          })
         
        }
      }
    })
    
  }
,//验证管理员
  admin:function(e){
    var db=wx.cloud.database()
    var coll=db.collection("admin")
    var userinfo=wx.getStorageSync("info")
    coll.where({admininfo: userinfo }).get({
      success: res => {
        var admininfo = res.data
        console.log(admininfo)
        if (admininfo.length != 0) {
          console.log("跳转到管理员管理页面")
          wx.navigateTo({
            url: '/pages/merchantoradmin/admin/choice/choice',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '对不起,只有管理员有权限进入',
          })
        }
      }
    })
  }
})