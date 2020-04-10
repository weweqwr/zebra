
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:[],
    arr:[],
    sum1:'',
    checkvalue:[],
    commissionvalue:0
  },
   
 
  //购物车展示代码
  showCar: function (e) {
    var that=this
    var car = wx.getStorageSync('cart') || []
    var skip=wx.getStorageSync('skip')||[]
      var arr = []
      //此处用的是云函数，不然数据库查询会异步
    console.log(car)
      wx.cloud.callFunction({
        name: "wxda",
        data: {
          arr: car
        }, success: function (res) {
          var sum = 0;
          var data1 = []
          arr = res.result
          var checkvalue = that.data.checkvalue
          var commissionvalue=that.data.commissionvalue    
          for (var i in arr) {
            data1 = data1.concat(arr[i].data)
            for (var j in checkvalue){
              //判断勾选的id在不在
              if (checkvalue[j] == data1[i]._id){
                sum += arr[i].count * data1[i].Price
              }
            } 
          }
          var grade=that.data.grade
          
          //普通会员9.5折
          if(grade==1){
            sum=sum*0.95
          }
          //超级会员8.8折
          if (grade == 2) {
            sum = sum*0.88
          }
          sum = sum - commissionvalue
          if(sum<0){
            sum=0
          }
          
          that.setData({ sum1: sum })
           that.setData({ cart: arr })
        },
        fail: console.error
      })
  },
  //实时显示
  onShow: function () {
    var that= this
    var db=wx.cloud.database()
    var coll = db.collection("membershipinfo")
    var userinfo=wx.getStorageSync("info")
    coll.where({merchantinfo:userinfo}).get({
      success:function(res){
        var grade=res.data[0].grade
        that.setData({grade:grade})
        console.log(grade)
      },fail:console.error
    })
    //调用显示购物车的方法
    that.showCar()
    that.jifen()
  },
  //货物-1
  delCount: function(event){
    var that=this
    var arr = wx.getStorageSync('cart') || []
    //获取点击的活泼id
    var id = event.currentTarget.dataset.id
    for(var i in arr){
      if(arr[i].id==id){
        var count=arr[i].count
        console.log(count)
        if(count==0){
          wx.showToast({
            title: '不能再减啦',
          })
        }else{
          arr[i].count=count-1
          wx.setStorageSync("cart", arr)
        }
      }
    }
    wx.switchTab({
      url: '/pages/car/car',
    })
    that.showCar()
  },
  //货物+1
  addCount: function (event) {
    var that = this
    var arr = wx.getStorageSync('cart') || []
    //获取点击的活泼id
    var id = event.currentTarget.dataset.id
    for (var i in arr) {
      if (arr[i].id == id) {
        var count = arr[i].count
          arr[i].count = count+1
          wx.setStorageSync("cart", arr)
      }
    }
    wx.switchTab({
      url: '/pages/car/car',
    })
    that.showCar()
  },
  //删除购物车
  delGoods: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '看看就好，买不起买不起',
      success:function(res){
        if(res.confirm){
          var id = event.currentTarget.dataset.id
          var arr = wx.getStorageSync("cart");
          for (var i in arr) {
            if (id == arr[i].id) {
              arr.splice(i, 1);
              console.log("删除成功")
            }
          }
          wx.setStorageSync("cart", arr)
          console.log(arr)
          that.showCar()
        }
      }
    })
  },
  //结算
  settleaccount:function (){
    var arr=wx.getStorageSync('info')
    if(arr.length==0){
      wx.showModal({
        title: '提示',
        content: '你还没登录呢,沙雕',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      var that = this
      //选中的货物id
      var checkvalue=that.data.checkvalue
      var selected=[]
      for(var i in checkvalue){
        selected[i]={}
        selected[i].id = checkvalue[i]
      }
      var cart=wx.getStorageSync('cart')||[]
      for (var i in cart){
        for (var j in selected){
          if (cart[i].id== selected[j].id){
            selected[j].count=cart[i].count
          }
        }
      }
      //价格总价
      var sum=that.data.sum1
      //用户信息
      var userInfo=wx.getStorageSync("info")
      //使用的价格
      var commissionvalue = that.data.commissionvalue
      //将货物信息存储到数据库中
      //调用插入云函数
      wx.cloud.callFunction({
        name:'order',
        data:{
          userinfo: userInfo,
          goodsid: selected,
          sum: sum,
          commission:commissionvalue
        },
        success:function(res){
        //把结算了的货品清除
        console.log(res.result)
        for(var i in cart){
          for (var j in checkvalue){
            if (selected[j].id==cart[i].id){
              cart.splice(i,1)
              wx.setStorageSync('cart', cart)
              that.showCar()
            }
          }
        }
        //显示
          that.showCar()
        }, 
        fail: console.error
      })
    }
  },
  //文本框实时修改
   modiffer:function(e){
     var that=this
     var id = e.currentTarget.dataset.id
     console.log(id)
     var arr=wx.getStorageSync('cart')
     for(var i in arr){
       if(id==arr[i].id){
         arr[i].count = e.detail.value
         wx.setStorageSync('cart', arr)
       }
     }
     that.showCar()
  },
  //checkbox的选中事件
  showCar1:function(e){
    var that=this
    var id = e.detail.value
    that.setData({ checkvalue: id})
    
    that.showCar()
  },
  //积分显示
  jifen:function(){
    var that = this
    var db=wx.cloud.database()
    var coll = db.collection("membershipinfo")
    var userinfo=wx.getStorageSync("info")
    coll.where({merchantinfo:userinfo}).get({
      success:function(res){
        console.log(res.data[0].commission)
        that.setData({ commission: res.data[0].commission})
      }
    })
  },
  //使用积分
  usecommission:function(e){
    var that=this
    var commissionvalue = e.detail.value
    var commission=that.data.commission
    var sum=that.data.sum1
    if (commissionvalue==""){
      commissionvalue=0
    }
    //该值不能大于积分
    if (commissionvalue > commission){
      commissionvalue = 0
      wx.showToast({
        title: '该值不能大于积分值',
        icon: 'none',
      })
      that.setData({ commissionvalue: commission })
      that.setData({value:0})
    }
    if(sum==0){
      wx.showToast({
        title: '价格已经为0',
        icon: 'none',
      })
      that.setData({ value: 0 })
    }
   
    
    console.log(commissionvalue)
    that.setData({ commissionvalue: commissionvalue})
    that.showCar()
  }

 

})
