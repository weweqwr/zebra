// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
const ordercoll=db.collection('order')
const goodscoll = db.collection('goods')
// 云函数入口函数
exports.main = async (event, context) => {
  
  var arr = await (ordercoll.where({userinfo:event.userInfo}).get());
  var order=arr.data
  var goods=[]
  var goodsave=[]
  var goodsid
  for(var i in order){
       goodsid = order[i].goodsid
       goods = await (goodscoll.where({ _id: order[i].goodsid[0].id}).get())//获取到照片的消息
       goods.sum = order[i].sum
       goods.pay = order[i].pay
       goods.count = order[i].goodsid[0].count
       goodsave = goodsave.concat(goods)
      
  }
  
  
  return goodsave;
}