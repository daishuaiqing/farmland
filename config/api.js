//本地开发
//var WxApiRoot = 'http://127.0.0.1:9001/';
var WxApiRoot = 'http://192.168.11.118:9001/';
//测试环境
//生产环境
module.exports = {
    WxApiRoot: WxApiRoot, //请求根目录
    IndexCategoryUrl: 'wx/home/category', //首页分类数据
    IndexGalleryUrl: 'wx/home/gallery', //首页图片数据
    WxLoginUrl: 'wx/user/login', //微信登陆
    UploadImage: 'upload/image', //批量上传图片
    GalleryAdd: 'gallery/add', //图片数据上传
};