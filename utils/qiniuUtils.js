var qiniu = require('qiniu');
var resolutions = require('../configs/config').resolutions;
// access_key and secret_key
qiniu.conf.ACCESS_KEY = ' ';
qiniu.conf.SECRET_KEY = ' ';

// 上传的空间
var bucket = ' ';

module.exports = {
    /**
     * 上传到骑牛
     * @param imgUrl 远程图片地址
     * @param callback
     */
    fetchToQiniu: function(imgURL, callback) {console.log('qiniuupload');
        var client = new qiniu.rs.Client();
        for (var i = 0, len = resolutions.length; i < len; i++) {
            var _temp = resolutions[i];
            var remoteURL = imgURL.replace('1920x1080', _temp);
            var _tempName = 'bing/' + imgURL.substr(imgURL.lastIndexOf('/') + 1, imgURL.length);
            var imgName = _tempName.replace('1920x1080', _temp);
            client.fetch(remoteURL, bucket, imgName, function(err, ret) {
                if (!err) {
                    console.log('qiniuOK:'+ret);
                } else {
                    console.log('qiniuERR:'+err);
                }
            });
        }
        callback && callback();
    },
    /**
     * 创建预览图片
     * @param {String} url      图片名称
     * @param {Number} width    缩略图宽度(默认1920)
     * @param {Number} height   缩略图高度(默认1080)
     * @param {Number} quality  图片质量(0-100,默认100)
     * @param {Number} mode     缩略图处理模式(默认1)
     *                              1:表示限定目标缩略图的宽度和高度，放大并从缩略图中央处裁剪为指定 <Width>x<Height> 大小的图片。
     *                              2:指定 <Width> 和 <Height>，表示限定目标缩略图的长和宽，将缩略图的大小限定在指定的宽高矩形内。
     *                              2:指定 <Width> 但不指定 <Height>，表示限定目标缩略图的宽度，高度等比缩略自适应。
     *                              2:指定 <Height> 但不指定 <Width>，表示限定目标缩略图的高度，宽度等比缩略自适应。
     * @return {String} fullURL
     * 
     */
    imageView: function(url, width, height, quality, mode) {
        width = width || 1920;
        height = height || 1080;
        quality = quality || 100;
        mode = mode || 1;
        var base = 'http://api.1ptime.com/bing/';
        url = url.indexOf('1920x1080') == -1 ? url + '_1920x1080.jpg' : url;
        url = /(http|https)\:\/\//.test(url) ? url : base + url;
        var imageView = new qiniu.fop.ImageView(mode, width, height, quality);
        return imageView.makeRequest(url);
    }
};