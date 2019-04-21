var user = require('./utils/user.js');
var api = require('./config/api.js');
var util = require('./utils/util.js');

App({
  onLaunch: function () {
    //检查是否有版本更新，如果有更新，提示用户更新至新版本
    const updateManager = wx.getUpdateManager()
    
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow: function (options) {
    //检查用户是否已经登陆
    user.checkLogin().then(res => {
      wx.setStorageSync('hasLogin', true);
    }).catch(() => {
      wx.setStorageSync('hasLogin', false);
    });
    
    /* wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    }) */
    if(wx.getStorageSync('hasLogin') == false){
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          const avatarUrl = userInfo.avatarUrl
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province
          const city = userInfo.city
          const country = userInfo.country
          wx.login({
            success(res) {
              if (res.code) {
                // 发起网络请求
                util.request(api.WxLoginUrl,{
                  code: res.code,
                  userInfo: {
                    nick: nickName,
                    avatar: avatarUrl,
                    gender: gender,
                    country: country,
                    province: province,
                    city: city
                  }
                },'POST').then(res => {
                    //存储用户信息
                    wx.setStorageSync('userInfo', res);
                    wx.setStorageSync('token', res.token);
                    wx.setStorageSync('hasLogin', true);
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    
    }

  },
  //全局数据配置
  globalData: {
    //hasLogin: false
  }

})

/**
 * 登录：
 * 启用应用以后，会检查用户是否登录，即检查用户是否在本地存储了userInfo；
 * 如果用户登陆了，则设置一个全局属性，标记用户处于登录状态；
 * 如果没有登录，则提示用户，需要获取用户信息；
 * 提示登陆的位置有三种：1，打开应用的时候；2，进入我的页面时；3，点击“点击登录”按钮时；
 * 如果用户在所有请求登录时都未选择登录，头像显示默认头像，用户信息位置显示“点击登录”
 * 
 * 为了安全起见，登陆后，服务端将会返回一个token，每次请求时，请求头携带此token，服务端即可辨别用户身份；
 * 应用可获取到的信息：用户头像,用户昵称，用户性别，认证信息；
 * 服务端不会传给应用用户的openid;
 */