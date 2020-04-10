// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const coll = db.collection('goods')
// 云函数入口函数
exports.main = async (event, context) => {
    //存储删除信息
  var file = {}
  file[0] = event.id
  var ad=await coll.where({Advertisement:event.id}).get()
  var goods = await coll.where({ GoodsImg: file }).get()
  var ad1=ad.data
  if (ad1.length != 0) {
    var aid = ad1[0]._id
    await coll.doc(aid).update({
      data:{
        Advertisement:""
      }
    })
    await cloud.deleteFile({ fileList: event.arr })
  }
  if (goods.data.length != 0) {
    var goodsid = goods.data[0]._id
    var gimg=goods.data[0].GoodsImg
    await cloud.deleteFile({ fileList: event.arr })
    for(var i in gimg){
      if(gimg[i]==event.id){
        gimg.splice(i,1)
      }
    }
    await  coll.doc(goodsid).update({
      data:{
      GoodsImg:gimg
      }
    })
   
  }
}