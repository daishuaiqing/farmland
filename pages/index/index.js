const util = require('../../utils/util.js');
const api = require('../../config/api.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    menuList: [], //菜单数据源
    currentTab: 1, //默认的分类table
    dataList: [], //图片数据源
    windowWidth: 0, //页面视图宽度
    windowHeight: 0, //视图高度
    imgMargin: 6, //图片边距: 单位px
    imgWidth: 0,  //图片宽度: 单位px
    topArr: [0, 0], //存储每列的累积top
    pageInfo: {
      page: 1, //初始页面 1
      size: 15 //每页的数据条数 15
    }
  },
  //切换分类
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      that.setData({
        dataList: [],
        windowWidth: 0, //页面视图宽度
        windowHeight: 0, //视图高度
        imgMargin: 6, //图片边距: 单位px
        imgWidth: 0,  //图片宽度: 单位px
        topArr: [0, 0], //存储每列的累积top
        pageInfo: {
          page: 1, //初始页面 1
          size: 15 //每页的数据条数 15
        }
      })
      wx.getSystemInfo({
        success: function (res) {
  
          var windowWidth = res.windowWidth;
          var imgMargin = that.data.imgMargin;
          //两列，每列的图片宽度
          var imgWidth = (windowWidth - imgMargin * 3) / 2;
  
          that.setData({
            windowWidth: windowWidth,
            windowHeight: res.windowHeight,
            imgWidth: imgWidth
          }, function () {
            that.loadMoreImages(); //初始化数据
          });
        },
      })
    }
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })
    //获菜单分类
    util.request(api.IndexCategoryUrl).then(res => {
      this.setData({
        menuList: res
      })
    })
    var that = this;
    //获取页面宽高度
    wx.getSystemInfo({
      success: function (res) {

        var windowWidth = res.windowWidth;
        var imgMargin = that.data.imgMargin;
        //两列，每列的图片宽度
        var imgWidth = (windowWidth - imgMargin * 3) / 2;

        that.setData({
          windowWidth: windowWidth,
          windowHeight: res.windowHeight,
          imgWidth: imgWidth
        }, function () {
          that.loadMoreImages(); //初始化数据
        });
      },
    })
  },
  loadImage: function (e) {

    var index = e.currentTarget.dataset.index; //图片所在索引
    var imgW = e.detail.width, imgH = e.detail.height; //图片实际宽度和高度
    var imgWidth = this.data.imgWidth; //图片宽度
    var imgScaleH = imgWidth / imgW * imgH; ///计算图片应该显示的高度

    var dataList = this.data.dataList;
    var margin = this.data.imgMargin;  //图片间距
    //第一列的累积top，和第二列的累积top
    var firtColH = this.data.topArr[0], secondColH = this.data.topArr[1];
    var obj = dataList[index];

    obj.height = imgScaleH;

    if (firtColH < secondColH) { //表示新图片应该放到第一列
      obj.left = margin;
      obj.top = firtColH + margin;
      firtColH += margin + obj.height;
    }
    else { //放到第二列
      obj.left = margin * 2 + imgWidth;
      obj.top = secondColH + margin;
      secondColH += margin + obj.height;
    }

    this.setData({
      dataList: dataList,
      topArr: [firtColH, secondColH],
    });
  },
  //加载更多图片
  loadMoreImages: function () {
    //从服务器获取图片数据
    util.request(api.IndexGalleryUrl,{
      page: this.data.pageInfo.page,
      categoryId: this.data.currentTab
    }).then(res => {
      if(res.length==0){
        return
      }
      var tmpArr = [];
      for(let i = 0; i < res.length; i++){
        var obj = {
          src: res[i].url,
          height: 0,
          top: 0,
          left: 0,
        }
        tmpArr.push(obj);
      }
      this.data.pageInfo.page += 1
      var dataList = this.data.dataList.concat(tmpArr)
      this.setData({ dataList: dataList }, function(){
        wx.hideLoading()
      });
    })
  },
  //预览图片
  previewImg: function (e) {

    var index = e.currentTarget.dataset.index;
    var dataList = this.data.dataList;
    var currentSrc = dataList[index].src;
    // var srcArr = dataList.map(function (item) {
    //   return item.src;
    // });

    wx.previewImage({
      urls: [currentSrc],
    })
  },
  
})
