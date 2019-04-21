const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    imageList: [],
    maxImageCount: 9,
    showOrHidden: true
  },
  onLoad: function () {
    util.request(api.IndexCategoryUrl).then(res => {
      this.setData({
        objectArray: res
      })
    })
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: that.data.maxImageCount - that.data.imageList.length,
      success: res => {
        console.log(res)
        let dataList = this.data.imageList.concat(res.tempFilePaths)
        that.setData({
          imageList: dataList
        })
        //如果图片数量达到9张，隐藏上传框
        if(this.data.imageList.length == 9){
          this.setData({
            showOrHidden: false
          })
        }
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
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  submit: function () {
    let categoryId = this.data.objectArray[this.data.index].id;
    var that = this;
    var index = 0; //第几张开始
    var successFiles = []; //成功的文件
    this.uploadFiles(this.data.imageList, index, successFiles, function (urls) {    //此处为抽出的公用方法，便于其它地方调用
      util.request(api.GalleryAdd,{
        urls: urls,
        categoryId: categoryId
      },'POST').then(res => {
        that.setData({
          imageList: [],
          showOrHidden: true,
          objectArray: []
        })
      })
    });
  },
  /**
 * 采用递归的方式多文件上传
 * imgPaths:需要上传的文件列表
 * index：imgPaths开始上传的序号
 * successFiles:已上传成功的文件
 * callBack：文件上传后的回调函数
 */
 uploadFiles: function(imgPaths, index, successFiles, callBack) {  
  var that = this;
  wx.showLoading({
    title: '正在上传第' + index + '张',
  })
  wx.uploadFile({
    url: api.WxApiRoot+api.UploadImage,
    filePath: imgPaths[index],
    name: 'image',
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function(res) {
     //成功,文件返回值存入成功列表
      if (res && res.data) {
        var data = JSON.parse(res.data);
        //if (data.isSuccess) {
          successFiles.push(data.url);
        //}
      }
    },
    complete: function(e) {
      index++; //下一张
      if (index == imgPaths.length) {
        wx.hideLoading();
        //上传完毕，作一下提示
        wx.showToast({
          title: '上传成功' + successFiles.length,
          icon: 'success',
          duration: 2000
        });
        if(callBack){
          callBack(successFiles);
        }
      } else {
        //递归调用，上传下一张
        that.uploadFiles(imgPaths, index,successFiles, callBack);
      }
    }
  })
}
})