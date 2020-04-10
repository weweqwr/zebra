// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const coll=db.collection('address')

// 云函数入口函数
exports.main = async (event, context) => {
  //先获取该用户数据库里的地址信息
  var beforeaddress = await (coll.where({ userinfo: event.userinfo }).get())
  if (beforeaddress.data.length==0) {//判断该用户是已经之前有地址信息了
    return await (coll.add({  //如果没有就插入地址信息
      data: {
        userinfo: event.userinfo,
        addressinfo: event.addressinfo,
      },
      fail: console.error
    }))
  } else{//有就修改数据
      //要修改的id
      var id = beforeaddress.data[0]._id
      //获取老地址
      var olderaddress = beforeaddress.data[0].addressinfo
      //把传过来的地址，和之前的地址合并
      var newaddress = olderaddress.concat(event.addressinfo)
     await( coll.doc(id).update({
      data:{
        addressinfo: newaddress
      },
       fail: console.error
    }))
  }
}