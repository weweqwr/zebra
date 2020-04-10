//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls1: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    menu: {
      imgUrls: [
        '/images/btn/1.png',
        '/images/btn/2.png',
        '/images/btn/3.png',
        '/images/btn/4.png',
        '/images/btn/5.png',
        '/images/btn/6.png',
        '/images/btn/7.png',
        '/images/btn/8.png',
        '/images/btn/9.png',
        '/images/btn/10.png',
        
      ],
      descs: [
        '全国包邮',
        '斑马出品',
        '发现',
        '外卖',
        '斑马国际',
        '热销榜单',
        '新人专享',
        '中国田',
        '到家',
        '斑马打车'
      ]
    }
  }, 
  onShow: function () {
    const db = wx.cloud.database()
    
    // 查询当前广告所有的 
    db.collection('goods').where({
      show:"1"
    }).get({
      success: res => {
       
        this.setData({imgUrls1: res.data})
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
    // 查询当前货物所有的 
    db.collection('goods').where({
      
    }).get({
      success: res => {

        this.setData({ imgUrls2: res.data })
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
  goodsevent: function (event) {
    //在tobar导航栏定义过的界面需要用这个方法跳转wx.switchTab
    //event.currentTarget.dataset.id获取id
    console.log(event.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/information/information?id='+event.currentTarget.dataset.id,
    })
    console.log("成功跳转");
  }, 
  //获取查询字段
  searchtext:function(e){
    var serarchtext=e.detail.value
    var that=this
    that.setData({
      serarchtext: serarchtext
    })
  },
  //模糊查询
  search:function(e){
    var that = this
    var serarchtext = that.data.serarchtext
    const db = wx.cloud.database()

    // 查询当前广告所有的 
    db.collection('goods').where({
      GoodsName: {								//columnName表示欲模糊查询数据所在列的名
        $regex: '.*' + serarchtext + '.*',		//queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
        $options: 'i'							//$options:'1' 代表这个like的条件不区分大小写,详见开发文档
      }
    }).get({
      success: res => {

        this.setData({ imgUrls2: res.data })
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
    
  }
})

