// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const coll = db.collection('order')
const coll2 = db.collection('membershipinfo')
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //获取上家id
  var top=await coll2.where({ subordinate: event.userinfo}).get()
  // 反积分给上家
  var commission1=event.sum/20
  if(top.data.length>0){//判断是否为最上家 20块钱1积分
    var topid = top.data[0]._id
    await coll2.doc(topid).update({
      data:{
        commission:_.inc(commission1)
      }
    })
  }
  //获取本身id
  var myself = await coll2.where({ merchantinfo: event.userinfo }).get()
  var myselfid = myself.data[0]._id
  
  //给本身添加积分 10块钱1积分
  var commission2 = event.sum / 10-event.commission
  await coll2.doc(myselfid).update({
    data: {
      commission: _.inc(commission2)
    }
  })
  return await coll.add({
    data:{
      userinfo: event.userinfo,
      goodsid: event.goodsid,
      sum:event.sum,
      pay:"未支付"
    }
  })
  //结算减积分

}