// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const coll=db.collection('goods')

// 云函数入口函数
exports.main = async (event, context) => {
  var flag=event.flag
  if (flag == false) {
   await coll.doc(event.id).update({
      data: {
        show: "0"
      }
    })
  } else if (flag == true) {
    await coll.doc(event.id).update({
      data: {
        show: "1",
      }
    })
  }
  
}