const WebSocketApi = (wss, app) => {
  wss.on('connection', (ws, req) => {
    let { url } = req // url 的值是 /$role/$uniId
    let { cusSender, cusReader } = app.context;
    // if (!url.includes('sender') || !url.includes('reader')) {
    //   return ws.close() // 关闭 url 前缀不是 /sender或/reader 的连接
    // }
    let [ role, uniId] = url.slice(1).split('/')
    if(!uniId) {
      console.log('缺少参数')
      return ws.close()
    }
    console.log('已连接客户端数量：', wss.clients.size)
    // 判断如果是发起端连接
    if (role == 'sender') {
      // 此时 uniId 就是 roomid
      ws.roomid = uniId
      let index = (cusSender = cusSender || []).findIndex(
        row => row.roomid == ws.roomid
      )
      // 判断是否已有该发送端，如果有则更新，没有则添加
      if (index >= 0) {
        cusSender[index] = ws
      } else {
        cusSender.push(ws)
      }
      app.context.cusSender = [...cusSender]
    }
    if (role == 'reader') {
      // 接收端连接
      ws.userid = uniId
      let index = (cusReader = cusReader || []).findIndex(
        row => row.userid == ws.userid
      )
      if (index >= 0) {
        cusReader[index] = ws
      } else {
        cusReader.push(ws)
      }
      app.context.cusReader = [...cusReader]
    }
    ws.on('close', () => {
      if (role == 'sender') {
        // 清除发起端
        let index = app.context.cusSender.findIndex(row => row == ws)
        app.context.cusSender.splice(index, 1)
        // 解绑接收端
        if (app.context.cusReader && app.context.cusReader.length > 0) {
          app.context.cusReader
            .filter(row => row.roomid == ws.roomid)
            .forEach((row, ind) => {
              app.context.cusReader[ind].roomid = null
              row.send('leaveline')
            })
        }
      }
      if (role == 'reader') {
        // 接收端关闭逻辑
        let index = app.context.cusReader.findIndex(row => row == ws)
        if (index >= 0) {
          app.context.cusReader.splice(index, 1)
        }
      }
    });
    // 接收消息
    ws.on('message', (msg) => {
      if (typeof msg != 'string') {
        msg = msg.toString()
        // return console.log('类型异常：', typeof msg)
      }
      let { cusSender, cusReader } = app.context;
      eventHandel(msg, ws, role, cusSender, cusReader);
    });    
  })
  // // 广播
  // wss.broadcast = function broadcast(data) {
  //   wss.clients.forEach(function each(client) {
  //     client.send(data);
  //   });
  // }
}

const eventHandel = (message, ws, role, cusSender, cusReader) => {
  if (role == 'reader') {
    let arrval = message.split('|')
    let [type, roomid, val] = arrval;
    if (type == 'message') {
      let seader = cusSender.find(row => row.roomid == roomid)
      console.log(cusSender, roomid, seader)
      if (seader) {
        console.log(message, type, val);
        seader.send(`${type}|${val}`)
      }
    }
  }
  if (role == 'sender') {
    let arrval = message.split('|')
    let [type, userid, val] = arrval
    // 注意：这里的 type, userid, val 都是通用值，不管传啥，都会原样传给 reader
    if (type == 'message') {
      let reader = cusReader.find(row => row.userid == userid)
      if (reader) {
        console.log(message, type, val)
        reader.send(`${type}|${val}`)
      }
    }
  }
}
  
module.exports = WebSocketApi