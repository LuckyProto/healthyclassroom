//index.js
//获取应用实例
const app = getApp()
// var API = require('../../utils/api.js')
const util = require('../../utils/util.js')
Page({
    data: {
        isiOS                          : false,  //设备信息 
        //请求参数
        banner_query_methodName        : 'sp_hc_banner_query',
        class_group_query_methodName   : 'sp_hc_class_group_app_query',  
        
        hidden                         : false,     //加载样式
	    //轮播图属性开始
	    imgPro: {
	    	imgUrls: [],
	    	indicatorDots: true,
	    	indicatorColor: "#EEEEEE",
	    	indicatorActiveColor: "#FFA334",
	    	autoplay: true,
	    	interval: 3000,
	    	duration: 800
	    },

        //套课参数
	    page_num: 1,
	    page_size: 2,
	    total_num: 0,
	    //套课列表
	    videoList: [],
        //是否加载完所有套课
	    is_all: false, 
        
  	},
  	navigateToLessons: function (event){
		let class_group_id = event.currentTarget.dataset.class_group_id;
		let doctor_num = event.currentTarget.dataset.doctor_num;
        // wx.setStorage({
        //     key: 'class_group_id',
        //     data: class_group_id,
        // })
		wx.navigateTo({
			url: '../lessons/lessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
		})
  	},
	//上拉加载
	onReachBottom(){
		var self = this;
		if(this.data.total_num == this.data.videoList.length){
			self.setData({
				'is_all': true,
                hidden: true
			})
		}else{
			//加载套课
			var	param = {
					page_num    : self.data.page_num,
					page_size   : self.data.page_size
				},
				sign = wx.getStorageSync('sign');
			wx.showLoading({
				title: '加载中',
			})
            util.fetchData(self.data.class_group_query_methodName, param, function (data) {
                if (data.total_num > 0) {
                    self.setData({
                        'videoList': self.data.videoList.concat(data.rows),
                        'page_num': self.data.page_num + 1,
                    })
                    wx.hideLoading();
                }
            })
		}
	},
    onLoad: function(){
        var self = this;
        //设备信息
        wx.getSystemInfo({
            success: function (res) {
                if (res.system.search('iOS') == 0) {
                    self.setData({
                        isiOS: true
                    })
                } else {
                    self.setData({
                        isiOS: false
                    })
                }
            }
        })
    },
  	onShow: function () {
        var self = this;
        // self.setData({
        //     isiOS: app.globalData.isiOS,
        // })
        // console.log(this.data.isiOS)
	  	setTimeout(function(){
            //获取轮播图数据
            var param = {
                page_num: 1,
                page_size: 5
            };
            util.fetchData(self.data.banner_query_methodName, param, function (data) {
                var banners = [];
                if (data.total_num > 0) {
                    data.rows.forEach(function (item, index, array) {
                        banners.push(item.resources_url);
                    });
                }
                self.setData({
                    'imgPro.imgUrls': banners,
                })
            })

            //获取套课数据
            var class_group_param = {
                page_num: 1,
                page_size: 30
            };
            util.fetchData(self.data.class_group_query_methodName, class_group_param, function (data) {
                if (data.total_num > 0) {
                    self.setData({
                        'videoList': data.rows,
                        'total_num': data.total_num,
                        'page_num': self.data.page_num + 1,
                        'page_size': 3
                    })
                    self.setData({
                        hidden: true
                    });
                }
            })
        }, 2000)
    }
})
