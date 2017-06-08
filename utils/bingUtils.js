var request = require('superagent');
var objectAssign = require('object-assign');
var commonUtils = require('./commonUtils');
var bingURL = 'http://www.bing.com/HPImageArchive.aspx';
var story = 'http://cn.bing.com/cnhp/coverstory/';
var cookie = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
module.exports = {
    /**
     * 获取 当日Bing图片
     */
    fetchPicture: function(options, callback) {
        var defaultOptions = {
            idx: 0,
            n: 1,
            format: 'js'
        };
        if (Object.prototype.toString.call(options) === '[object Object]') {
            // 合并对象
            defaultOptions = objectAssign(defaultOptions, options);
        } else {
            callback = options;
        }
        // console.log('defaultOptions:'+JSON.stringify(defaultOptions, '', 4));
        request
            .get(bingURL)
            .set(cookie)
            .query(defaultOptions)
            .end(function(err, res) {
                commonUtils.convert(err, res, function(data) {
                    //console.log('Data:'+JSON.stringify(data['images'][1], '', 4));
                    //console.log(data['images'].length);
                    for(var i in data['images']) {
                    //for (var i = data['images'].length-1;i>=0;i--) {
                        var images = data['images'][i];
                        //console.log(images['enddate']);
                        //const days=images['enddate'];
                        //console.log('images:'+ images['enddate']+':'+JSON.stringify(images,'',4));
                        module.exports.fetchStory({
                            d: images['enddate']
                        }, function(dataStory) {
                            //console.log('imagesInStory:'+ images['enddate'] +':'+JSON.stringify(images,'',4));
                            //console.log('dataStory'+ images['enddate'] +':'+JSON.stringify(dataStory,'',4));
                            data = objectAssign(images, dataStory);
                            //console.log('AssignData'+ images['enddate']+':'+JSON.stringify(data,'',4));
                            var newData = {
                                startdate: data.startdate,
                                fullstartdate: data.fullstartdate,
                                enddate: data.enddate,
                                url: /(http|https)\:\/\//gi.test(data.url) ? data.url : 'http://s.cn.bing.net' + data.url,
                                urlbase: data.urlbase,
                                copyright: data.copyright,
                                copyrightlink: data.copyrightlink,
                                hsh: data.hsh,
                                title: data.title,
                                description: data.description,
                                attribute: data.attribute,
                                country: data.country,
                                city: data.city,
                                longitude: data.longitude,
                                latitude: data.latitude,
                                continent: data.continent
                            }
                            //console.log('newData'+ images['enddate']+':'+JSON.stringify(newData,'',4));
                            callback && callback(newData);
                        });
                    }
                });
            });
    },
    /**
     * 获取 当前Bing返回的所有图片集合
     */
    fetchPictures: function(callback) {
        var options = {
            idx: 1,
            n: 2,
            format: 'js'
        };
        module.exports.fetchPicture(options, callback);
    },
    /**
     * 获取 每日故事(默认当日)
     * 
     * 若需要查询指定日期：
     * options = {
     *      d:20161015
     * }
     */
    fetchStory: function(options, callback) {
        if (Object.prototype.toString.call(options) === '[object Function]') {
            callback = options;
            options = {};
        }
        //console.log('StoryOptions:'+JSON.stringify(options,'',4));
        request
            .get(story)
            .set(cookie)
            .query(options)
            .end(function(err, res) {
                commonUtils.convert(err, res, function(data) {
                    //console.log('StoryERR:'+JSON.stringify(err,'',4));
                    //console.log('StoryRES:'+JSON.stringify(res,'',4));
                    data['description'] = data.para1 || data.para2 || '';
                    data['country'] = data.Country || '';
                    data['city'] = data.City || '';
                    data['longitude'] = data.Longitude || '';
                    data['latitude'] = data.Latitude || '';
                    data['continent'] = data.Continent || '';
                    //console.log('StoryData'+options.d+':'+JSON.stringify(data,'',4));
                    callback && callback(data);
                });
            });
    }
};