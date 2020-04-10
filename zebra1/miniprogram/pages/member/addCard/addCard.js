// miniprogram/pages/member/addCard/addCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardname:[],
    discount:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow:function(){
    var that =this
    that.show()
  },
  show:function(){
    var that = this
    var db= wx.cloud.database()
    var coll = db.collection("membershipcard")
    coll.get({
      success:function(res){
        var merbershipcard=res.data
        that.setData({
          merbershipcard: merbershipcard
        })
      },
      fail:console.errors
    })
  },
  pay:function(e){
    var that = this
    var db=wx.cloud.database()
    var coll = db.collection("membershipinfo")
    var id=e.currentTarget.dataset.id
    var userinfo=wx.getStorageSync("info")
    var timestamp = Date.parse(new Date())
    var start = new Date();
    
    console.log(start)
    // console.log(end)
    // coll.add({
    //   success:{
    //     userinfo:userinfo,
    //     membershipid: membershipid,
    //     start:start
    //   },
    //   fail:console.error
    // })
  }
 
})