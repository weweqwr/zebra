// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const coll = db.collection("membershipinfo")
// 云函数入口函数
exports.main = async (event, context) => {
  var boss = await coll.where({ _id: event.invite }).get()
  //定义个空数组
  var arr=[]
  if(boss.data.length>0){
    await coll.add({
      data:{
          merchantinfo:event.userinfo,
          subordinate:arr,
          commission:0
      },
    })
    var subor = boss.data[0].subordinate
    var username1=subor.concat(event.userinfo)
    await coll.doc(event.invite).update({
      data:{
       subordinate: username1
      }
    })
    return true
  }else{
    return false
  }
  
  

}