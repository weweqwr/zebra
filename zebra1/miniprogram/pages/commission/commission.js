// miniprogram/pages/commission/commission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantinfo:[]
  },
  onShow: function () {
    var that = this
    that.show()
  },
  show:function(){
    var that=this
    var db=wx.cloud.database()
    var coll = db.collection("membershipinfo")
    var userinfo=wx.getStorageSync("info")
    coll.where({merchantinfo:userinfo}).get({
      success:function(res){
        //获取积分
        var flag = res.data[0].commission
        var percent=0;
        var end=0;
        var grade;
       
        //小于300为普通用户
        if(flag<=300){
           percent = (flag / 300) * 100
           end=300
           grade="普通用户"
          coll.doc(res.data[0]._id).update({
            data: {
              grade: 0
            },
            fail: console.error
          })
           
        } else if (flag > 300&&flag<=1000){
        //300积分到1000积分为普通会员
           percent = (flag/1000)*100
            end =1000
            grade="普通会员"
          coll.doc(res.data[0]._id).update({
            data: {
              grade: 1
            },
            fail: console.error
          })
        }else if(flag>1000){
        //1000积分到无穷大为超级会员
           percent = (flag/ 10000) * 100
           end =10000
           grade="超级会员"
          coll.doc(res.data[0]._id).update({
            data: {
              grade: 2
            },
            fail: console.error
          })
        }
        that.setData({
          merchantinfo: res.data,
          percent: percent,
          grade:grade,
          start:flag,
          end: end
        })
        
      },
      fail:console.error
    })
  },
  //分值比
})