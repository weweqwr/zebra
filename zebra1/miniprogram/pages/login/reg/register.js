// miniprogram/login/reg/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite:""
  },
  //获取账号
  usernameInput:function(e){
    var that=this
    var username = e.detail.value
    that.setData({
      username:username
    })
  },
  //获取密码
  passwordInput: function (e) {
    var that = this
    var password = e.detail.value
    that.setData({
      password:password
    })
  },
  //获取邀请码
  invite: function(e) {
    var that = this
    var invite = e.detail.value
    that.setData({
      invite:invite
    })
  },
  //邀请码注册
  bindGetUserInfo:function(e){
    var that = this
    var invite = that.data.invite
    
    if (invite == "") {
      wx.showToast({
        title: '用户、密码、邀请码不能位空',
        icon: "none"
      })
    }
    else{
      
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        var userinfo = e.detail.userInfo
        console.log(userinfo)
        wx.cloud.callFunction({
          name: "register",
          data: {
            userinfo: userinfo,
            invite: invite
          },
          success: function (res) {
            if (res.result == true) {
              wx.setStorageSync("info", e.detail.userInfo)
              wx.showToast({
                title: '注册成功,您以登录',
                icon: "none"
              })
              wx.switchTab({
                url: '/pages/mine/mine',
              })
            } else {
              wx.removeStorageSync("userinfo")
              if (res.result == false) {
                wx.showToast({
                  title: "请输入正确的邀请码",
                  icon: "none"
                })
                wx.removeStorageSync("info")
              }
            }
          },
          fail: console.error
        })
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
      
    }
  }
})