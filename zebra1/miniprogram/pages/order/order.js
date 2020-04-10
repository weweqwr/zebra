// miniprogram/pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    currtab: 0,
    swipertab: [{ name: '待付款', index: 0 }, { name: '待收货', index: 1 }, { name: '待评价', index: 2 },{ name: '退换/售后', index: 3 }],
  },

 
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.orderShow()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  },

  tabChange: function (e) {
    this.setData({ currtab: e.detail.current })
    this.orderShow()
  },

  orderShow: function () {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
      case 2:
        that.lostShow()
        break
    }
  },
  // alreadyShow: function () {
  //   this.setData({
  //     alreadyOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "交易成功", time: "2018-09-30 14:00-16:00", status: "已结束", url: "../../images/bad0.png", money: "132" }, { name: "跃动体育运动俱乐部(圆明园店)", state: "交易成功", time: "2018-10-12 18:00-20:00", status: "未开始", url: "../../images/bad3.jpg", money: "205" }]
  //   })
  // },

  waitPayShow: function () {
    this.setData({
      waitPayOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "待付款", time: "2018-10-14 14:00-16:00", status: "未开始", url: "../../images/bad1.jpg", money: "186" }],
    })
  },

  lostShow: function () {
    this.setData({
      lostOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "已取消", time: "2018-10-4 10:00-12:00", status: "未开始", url: "../../images/bad1.jpg", money: "122" }],
    })
  },
  //显示未付款的订单
  alreadyShow :function(){
    var that=this
      var userInfo=wx.getStorageSync('info')||[]
    wx.cloud.callFunction({
      name:"queryorder",
      data:{
        userInfo:userInfo
      },
      success:function(res){
        var order=res.result
        var info=[]
        
        for(var i in order){
          info[i] = order[i].data[0]
          info[i].count=order[i].count
          info[i].sum = order[i].sum
          info[i].pay = order[i].pay
        }
       // var heigh=165*order.length
        var he = order.length * 165
        that.setData({alreadyOrder:info})
        that.setData({height:he})
        
        console.log(info)
        console.log(order.length*165)
        
      },
      fail:console.error
    })

  }

})
