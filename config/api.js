//本地开发
var WxApiRoot = 'http://192.168.0.103/wx/';
//测试环境
//生产环境
module.exports = {
    WxApiRoot: WxApiRoot, //请求根目录
    IndexCategoryUrl: 'home/category', //首页分类数据
    IndexGalleryUrl: 'home/gallery', //首页图片数据
    WxLoginUrl: 'user/login', //微信登陆
};