// miniprogram/pages/merchantoradmin/admin/merequest/merequest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    currtab: 0,
    request:[],
    swipertab: [{ name: '申请', index: 0 }, { name: '删除', index: 1 }, { name: '待评价', index: 2 }, { name: '退换/售后', index: 3 }],
    height:0
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
    this.onShow()
  },

  onShow: function () {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.request()
        break
      case 1:
        that.delmerchant()
        break
      case 2:
       // that.lostShow()
        break
    }
  },
  

  
  //显示商家申请请求
  request: function () {
    var that=this
    var db=wx.cloud.database()
    var coll = db.collection('merchant')
    coll.where({status:"未处理"}).get({
      success:function(res){
        var request = res.data
        var height = request.length * 265
        that.setData({
          height:height,
          request: request
        })
      },
      fail:console
     })
  },
  //接受
  accept:function(e){
    var that=this
    var id = e.currentTarget.dataset.id
    var db=wx.cloud.database()
    var coll = db.collection("merchant")
    console.log(id)
    coll.doc(id).update({
      data:{
        status:"接受"
      }, 
      success:function(){
        that.request()
      },
      fail: console.error
    })
    
  },
  //拒绝
  reject:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var db = wx.cloud.database()
    var coll = db.collection("merchant")
    coll.doc(id).update({
      data: {
        status: "拒绝"
      },
      success: function () {
        that.request()
      },
      fail:console.error
    })
  },
  //显示商家申请请求
   delmerchant: function () {
    var that = this
    var db = wx.cloud.database()
    var coll = db.collection('merchant')
    coll.where({ status: "接受" }).get({
      success: function (res) {
        var request = res.data
        var height = request.length * 220
        that.setData({
          height: height,
          request: request
        })
      },
      fail: console
    })
  },
  delmerchantinfo:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var db = wx.cloud.database()
    var coll = db.collection('merchant')
    wx.showModal({
      title: '提示',
      content: '你确定要删除这商家信息吗？一旦删除将不可恢复。',
      success: function (res) {
        if (res.confirm) {
          coll.doc(id).remove({
            success: function () {
              that.delmerchant()
            },
            fail: console.error
          })
        }
        wx.showToast({
          title: '该商家以删除',
          icon: 'none',
        })
      }
    })
    
    
  }
})