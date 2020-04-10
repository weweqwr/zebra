// pages/information/information.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ne:[],
    imgUrls:[],
    is_shoucang: 0,
    goods_info: { goods_id: 1, goods_title: "商品标题1", goods_price: '100', goods_yunfei: 0, goods_kucun: 100, goods_xiaoliang: 1, content: '商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情' },
    goods_img: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    pjDataList: [{ headpic: '/images/navimages/car_default.png', author: '张三', add_time: '2018-06-01', content: '好评好评，真实太好了!' },
      { headpic: '/images/navimages/car_default.png', author: '张三', add_time: '2018-06-01', content: '好评好评，真实太好了!' }
    ],//评价数据
  },


  previewImage: function (e) {
    var current = e.target.dataset.src;
    var href = this.data.imghref;
    var goodsimg = this.data.goods_img;
    var imglist = [];
    for (var i = 0; i < goodsimg.length; i++) {
      imglist[i] = href + goodsimg[i].img
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist// 需要预览的图片http链接列表  
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接受数据库传过来的id
    var that = this
    this.setData({
      id: options.id
    })
    console.log(that.data.id)

    const db = wx.cloud.database()
    // 查询当前用户所有的 
    db.collection('goods').where({
      _id:that.data.id
    }).get({
      success: res => {
        this.setData({ne:res.data})
        this.setData({imgUrls: res.data })
        console.log(imgUrls)
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //加入购物车
  addtocar: function (event) {
  
    var id = event.currentTarget.dataset.id
    var arr = wx.getStorageSync('cart', arr)||[]
    console.log(id);
    console.log(arr.length)
    var flag=true;
    if (arr.length > 0) {
      // 遍历购物车数组
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等
        if (arr[j].id == id) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）
          arr[j].count = arr[j].count + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）
          try {
            wx.showToast({
              title: '加入购物车成功',
            })
            wx.setStorageSync('cart', arr)
            flag=true
            console.log(arr)
          } catch (e) {
            console.log(e)
          }
          // 返回（在if内使用return，跳出循环节约运算，节约性能）
          return;
        } else {
          flag=false
        }    
      }
      if(flag==false){
        var size=arr.length
        arr[size] = {}
        arr[size].id = id
        arr[size].count = 1
        wx.setStorageSync('cart', arr)
        wx.showToast({
          title: '加入购物车成功',
        })
      }
    }else if (arr.length == 0) {
      arr[0] = {}
      arr[0].id = id
      arr[0].count= 1
      wx.setStorageSync('cart', arr)
      wx.showToast({
        title: '加入购物车成功',
      })
    }
    
  }


  
})