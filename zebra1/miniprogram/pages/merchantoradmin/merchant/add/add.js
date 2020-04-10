// component/uploadImages/index.js
Page({
 
  data: {
    detailPics: [], //上传的结果图片集合
    goodsUrl:[],
  },
  adimg:function(e){
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
          cloudPath:"advertiseimages/" +timestamp + '.png',
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
  gooodsimg:function(e){
    console.log("这个是点击事件")
    let that = this;
    let timestamp = (new Date()).valueOf();
    var goodsUrl  =that.data.goodsUrl
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
              var url=[]
              url[0]={}
              url[0] = res.fileID
              goodsUrl=goodsUrl.concat(url)
              that.setData({
                zhaopian: '图片如下',
                goodsUrl: goodsUrl
              })
            }
          },
        })
      },
    })
  },
  goodsname:function(e){
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
    var adUrl=that.data.adUrl
    var goodsUrl=that.data.goodsUrl
    var name = that.data.name
    var goodsname = that.data.goodsname
    var price = that.data.price
    var userinfo=wx.getStorageSync("info")
    var db=wx.cloud.database()
    var coll=db.collection("goods")
    coll.add({
      data:{
        Advertisement: adUrl,
        GoodsImg: goodsUrl,
        GoodsName: goodsname,
        Price:price,
        userinfo: userinfo,
        show:"0"
      },
      success:function(){
        wx.showToast({
          icon:"none",
          title: '商品添加成功',
        })
      }
    })
  },



})