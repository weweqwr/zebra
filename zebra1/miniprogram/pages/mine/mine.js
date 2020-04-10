/// pages/mine/mine.js
var app = getApp()

Page({

  data: {

    userInfo: {},
    isHide:false,
    hasUserInfo: false,
    
    avatarUrl: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    orderItems: [

      {

        typeId: 0,

        name: '待付款',

        url: 'bill',

        imageurl: '/images/mine/wait_pay.png',

      },

      {

        typeId: 1,

        name: '待收货',

        url: 'bill',

        imageurl: '/images/mine/wait_receive.png',

      },

      {

        typeId: 2,

        name: '待评价',

        url: 'bill',

        imageurl: '/images/mine/comment.png'

      },

      {

        typeId: 3,

        name: '退换/售后',

        url: 'bill',

        imageurl: '/images/mine/refund.png'

      }

    ],

  },
  onShow: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        var arr = wx.getStorageSync('info')||[]
        
        if (arr.length!=0) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: res => {
                  console.log("用户的code:" + res.code);
                  that.setData({ avatarUrl:arr.avatarUrl})
                  that.setData({ userInfo:arr })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    var db=wx.cloud.database()
    var coll = db.collection("membershipinfo")
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      coll.where({ merchantinfo: e.detail.userInfo}).get({
        success:function(res){
          console.log(res.data)
          // if(res.data.length>0){
            that.setData({ avatarUrl: e.detail.userInfo.avatarUrl })
            that.setData({ userInfo: e.detail.userInfo })

            wx.setStorageSync("info", e.detail.userInfo)
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
              isHide: false
            });
          // }else{
          //     wx.showToast({
          //       title: '您不是会员,请马上注册',
          //       icon:"none"
          //     })
          // }
        },
        fail:console.error
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
  }, 
  //四个按钮跳转到订单页面
  order:function(e){
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  //地址管理的跳转
  defaultaddress:function(e){
    wx.navigateTo({
      url: '/pages/address/defaultaddress/defaultaddress',
    })
  },
  //管理员或商家登录
  merchantoradmin: function (e) {
    wx.navigateTo({
      url: '/pages/merchantoradmin/choice/choice',
    })
  },
  //会员卡组件
  member:function(){
    wx.navigateTo({
      url: '/pages/member/addCard/addCard',
    })
  },
  //登录注册
  login: function () {
    wx.navigateTo({
      url: '/pages/login/reg/register',
    })
  },
  //下家跳转
  subordinate:function(){
    wx.switchTab({
      url: '/pages/commission/commission',
    })
  },
  //退出
  quit:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '你确定退出吗',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync("info")
          that.setData({
            isHide: true
          });
          that.onShow()
        }
      }
    })
  }
})