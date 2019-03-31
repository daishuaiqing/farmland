var api = require('../config/api.js');
//格式化时间对象
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: api.WxApiRoot+url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        // 'X-Litemall-Token': wx.getStorageSync('token') 请求的时候带着token
      },
      success: function(res) {

        if (res.statusCode == 200) {

          if (res.data.code == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: 'pages/logs/logs'
            });
          } else {
            //if(res.data.code == 200){
              resolve(res.data.data);
            //}
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  request
}
