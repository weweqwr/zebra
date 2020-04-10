// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const dbgoods=db.collection('goods');
// 云函数入口函数
exports.main = async (event, context) => {
  var arr1 = []
  var arr2 = []
 var arr=event.arr
  if (arr.length>0){
   for (var i in arr) {
     arr2 = await (dbgoods.where({ _id: arr[i].id}).get())
     arr1=arr1.concat(arr2)
     arr1[i].count = arr[i].count
   }
 }
  return  arr1
}