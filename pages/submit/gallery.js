Page({
  data: {
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
  }
})