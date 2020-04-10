// miniprogram/pages/address/newaddress/newaddress.js
var area = require('/resources/area.js');
var areaInfo = []; //所有省市区县数据
var provinces = []; //省
var provinceNames = []; //省名称
var citys = []; //城市
var cityNames = []; //城市名称
var countys = []; //区县
var countyNames = []; //区县名称
var value = [0, 0, 0]; //数据位置下标
var addressList = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transportValues: ["收货时间不限", "周六日/节假日收货", "周一至周五收货"],
    transportIndex: 0,
    provinceIndex: 0, //省份
    cityIndex: 0, //城市
    countyIndex: 0, //区县
    getAddress:0,//详细地址
    getRealName:0,//真实姓名
    getPhone:0//电话

  },

  onShow: function () {
    var that = this;
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      that.getProvinceData();
    });
  },
  // 获取省份数据
  getProvinceData: function () {
    var that = this;
    var s;
    provinces = [];
    provinceNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      s = areaInfo[i];
      if (s.di == "00" && s.xian == "00") {
        provinces[num] = s;
        provinceNames[num] = s.name;
        num++;
      }
    }
    that.setData({
      provinceNames: provinceNames
    })

    that.getCityArr();
    that.getCountyInfo();
  },

  // 获取城市数据
  getCityArr: function (count = 0) {
    var c;
    citys = [];
    cityNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
        citys[num] = c;
        cityNames[num] = c.name;
        num++;
      }
    }
    if (citys.length == 0) {
      citys[0] = {
        name: ''
      };
      cityNames[0] = {
        name: ''
      };
    }
    var that = this;
    that.setData({
      citys: citys,
      cityNames: cityNames
    })
    console.log('cityNames:' + cityNames);
    that.getCountyInfo(count, 0);
  },

  // 获取区县数据
  getCountyInfo: function (column0 = 0, column1 = 0) {
    var c;
    countys = [];
    countyNames = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
      c = areaInfo[i];
      if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
        countys[num] = c;
        countyNames[num] = c.name;
        num++;
      }
    }
    if (countys.length == 0) {
      countys[0] = {
        name: ''
      };
      countyNames[0] = {
        name: ''
      };
    }
    console.log('countyNames:' + countyNames);
    var that = this;
    // value = [column0, column1, 0];

    that.setData({
      countys: countys,
      countyNames: countyNames,
      // value: value,
    })
  }, bindTransportDayChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      transportIndex: e.detail.value
    })
  },

  bindProvinceNameChange: function (e) {
    var that = this;
    console.log('picker province 发生选择改变，携带值为', e.detail.value);
    var val = e.detail.value
    that.getCityArr(val); //获取地级市数据
    that.getCountyInfo(val, 0); //获取区县数据

    value = [val, 0, 0];
    this.setData({
      provinceIndex: e.detail.value,
      cityIndex: 0,
      countyIndex: 0,
      value: value
    })

  },

  bindCityNameChange: function (e) {
    var that = this;
    console.log('picker city 发生选择改变，携带值为', e.detail.value);

    var val = e.detail.value
    that.getCountyInfo(value[0], val); //获取区县数据
    value = [value[0], val, 0];
    this.setData({
      cityIndex: e.detail.value,
      countyIndex: 0,
      value: value
    })
  },

  bindCountyNameChange: function (e) {
    var that = this;
    console.log('picker county 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countyIndex: e.detail.value
    })
  },

  //获取详细地址
  getAddress:function(e){
    var address=  e.detail.value
    var that =this
    that.setData({getAddress:address})
  }, 
  //获取真实姓名
  getRealName: function(e) {
    var getRealName = e.detail.value
    var that = this
    that.setData({ getRealName: getRealName })
  },
  //获取电话
  getPhone: function (e) {
    var getPhone = e.detail.value
    var that = this
    that.setData({ getPhone: getPhone })
  },
  
  //保存address
  saveaddress:function(e){
    var that=this
    //省index
    var a=that.data.provinceIndex
    //城市index
    var b = that.data.cityIndex
    //县级index
    var c = that.data.countyIndex
    var realname = that.data.getRealName
    var phone = that.data.getPhone
    var userinfo=wx.getStorageSync("info")
    var address = that.data.provinceNames[a] + "," + that.data.cityNames[b] + "," + that.data.countyNames[c]+that.data.getAddress
    //插入地址信息到云数据库address
    const db=wx.cloud.database()
    const coll=db.collection('address')
    var addressinfo=[]
    addressinfo[0]={}
    addressinfo[0].realname=realname
    addressinfo[0].phone=phone
    addressinfo[0].address=address
     wx.cloud.callFunction({
        name:'newaddress',
        data:{
          userinfo:userinfo,
          addressinfo:addressinfo
        },
        success:function (res){
          console.log(res.result)
          wx.showToast({
            title: '添加地址成功',
            duration:1000
          })
          setTimeout(
            function(){
              wx.navigateTo({
                url: '/pages/address/defaultaddress/defaultaddress',
              })
            },1000
          )
        },
        fail:console.error
      })
     that.onShow()
  }
})