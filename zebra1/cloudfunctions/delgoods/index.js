// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const coll=db.collection('goods')
// 云函数入口函数
exports.main = async (event, context) => {
  //先获取里面的照片
  var goods= await coll.where({ _id: event.id }).get()
  var advertisementImg =[]
  advertisementImg[0] = goods.data[0].Advertisement
  var goodsImg = goods.data[0].GoodsImg

  // 删除file文件
    // 删除广告文件
  if (goods.data[0].Advertisement!=""){
      await cloud.deleteFile({
        fileList: advertisementImg
      })
     }
      //删除商品展示图片
  if (goodsImg.length>0){
      await cloud.deleteFile({
        fileList: goodsImg,
      })
    }
    
    //删除goods数据
    await coll.doc(event.id).remove()

}