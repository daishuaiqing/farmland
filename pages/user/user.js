// pages/user/user.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  toSubmit(){
    wx.navigateTo({
      url: '/pages/submit/gallery'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.hasLogin == false){
        this.setData({
          avatar: '../../images/user/user_icon.png',
          nick: '未登录',
          uploader: '点击使用微信登录',
          isShowAuth: true
        })
    }else{
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        avatar: userInfo.avatar,
        nick: userInfo.nick,
        uploader: userInfo.uploader == 1 ? '已认证' : '未认证',
        isShowAuth: false
      });
    }
  },
  wxLogin: function (e) {
    var that = this;
    if(app.globalData.hasLogin == false){
      if (e.detail.userInfo == undefined) {
        app.globalData.hasLogin = false;
        return;
      }else{
        // 用户已经同意小程序获取用户信息
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
                      that.setData({
                        avatar: res.avatar,
                        nick: res.nick,
                        uploader: res.uploader == 1 ? '已认证' : '未认证',
                        isShowAuth: false
                      });
                      app.globalData.hasLogin == true
                  })
                }
              }
            })
          }
        })
      }  
      
      
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})