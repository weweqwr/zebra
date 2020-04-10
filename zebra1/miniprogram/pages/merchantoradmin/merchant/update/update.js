// miniprogram/pages/merchantoradmin/merchant/update/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsname:[],
    price:[]
  },
  onLoad:function(e){
    var that=this
    const id = e.id
    that.setData({
      id:id
    })
    that.show()
  },
  show:function(e){
    var that = this
    var db =wx.cloud.database()
    var coll=db.collection('goods')
    var id=that.data.id
    coll.where({_id:id}).get({
        success:function(res){
          var goods=res.data
          var goodsname=goods[0].GoodsName
          var Price=goods[0].Price
          var adImg = goods[0].Advertisement
          var goodsImg = goods[0].GoodsImg
          that.setData({
            goodsname:goodsname,
            price:Price,
            adImg:adImg,
            goodsImg:goodsImg
          })
        },fail:console.error
    })
  },
  adimg: function (e) {
    let that = this;
    let timestamp = (new Date()).valueOf();
    wx.chooseImage({
      success: chooseResult => {
        wx.showLoading({
          title: '上传中。。。',
        })
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: "advertiseimages/" + timestamp + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log(chooseResult.tempFilePaths[0])
            console.log('上传成功', res)
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
            if (res.fileID) {
              that.setData({
                zhaopian: '图片如下',
                adUrl: res.fileID
              })
            }
          },
        })
      },
    })
  },
  gooodsimg: function (e) {
    console.log("这个是点击事件")
    let that = this;
    let timestamp = (new Date()).valueOf();
    var goodsImg = that.data.goodsImg
    var id = that.data.id 
    var db=wx.cloud.database()
    var coll=db.collection("goods")
    wx.chooseImage({
      success: chooseResult => {
        wx.showLoading({
          title: '上传中。。。',
        })
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: "Goods/" + timestamp + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log(chooseResult.tempFilePaths[0])
            console.log('上传成功', res)
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
            if (res.fileID) {
              var url = []
              url[0] = {}
              url[0] = res.fileID
              goodsImg = goodsImg.concat(url)
              that.setData({
                zhaopian: '图片如下',
                goodsImg: goodsImg
              })
            }
          },
        })
      },
    })
  },
  //修改添加照片
  goodsname: function (e) {
    var goodsname = e.detail.value
    var that = this
    that.setData({
      goodsname: goodsname
    })
  },
  price: function (e) {
    var price = e.detail.value
    var that = this
    that.setData({
      price: price
    })
  },


  submit:function(e){
    var that = this
    var id=that.data.id
    var adUrl = that.data.adUrl
    var goodsUrl = that.data.goodsUrl
    var name = that.data.name
    var goodsname = that.data.goodsname
    var price = that.data.price
    var userinfo = wx.getStorageSync("info")
    var db = wx.cloud.database()
    var coll = db.collection("goods") 
  },
  //长按删除照片
  deleteImage:function(e){
    var that=this
    var fileId= e.currentTarget.dataset.id
    var arr=[]
    arr[0]=fileId
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if(res.confirm)
        {
        wx.cloud.callFunction({
          name:"longpress",
          data:{
            id:fileId,
            arr:arr
          },success:function(res){
            console.log(res.result)
            that.show()
          },
          fail:console.error
        })
        }
      }
    })
  },
  //修改其他信息
   submit: function (e) {
    var that = this
    var id = that.data.id 
    var goodsname = that.data.goodsname
    var price = that.data.price
    var goodsImg = that.data.goodsImg
    var db = wx.cloud.database()
    var coll = db.collection("goods")
    coll.doc(id).update({
      data: {
        GoodsImg: goodsImg,
        GoodsName: goodsname,
        Price: price,
      },
      success: function () {
        wx.showToast({
          icon: "none",
          title: '商品修改成功',
        })
        that.show()
      }
    })
  },


})