Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    imageList: [],
    countIndex: 9,//最多上传图片的数量
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      success: res => {
        console.log(res)
        let dataList = this.data.imageList.concat(res.tempFilePaths)
        that.setData({
          imageList: dataList
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})