// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
var db = cloud.database()
var coll = db.collection('address')

// 云函数入口函数
exports.main = async (event, context) => {
  var id =0
  var arr=[]
  var oldaddress=[]
  oldaddress=await coll.where({ addressinfo: event.addressinfo }).get()
  arr = oldaddress.data[0].addressinfo
  id = oldaddress.data[0]._id
  for (var i in arr) {
    if (JSON.stringify(arr[i]) == JSON.stringify(event.addressinfo)) {
      arr.splice(i, 1)
    }
  }
  
   await coll.doc(id).update({
    data:{
      addressinfo:arr
    },
    fail:console.error
  })
  
}