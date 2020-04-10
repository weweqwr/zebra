// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const coll=db.collection("address")
// 云函数入口函数
exports.main = async (event, context) => {
  var address=coll.where({userinfo:userinfo}).get()
  var addressinfo = address.data[0].addressinfo
  return addressinfo
}