//index.js
//获取应用实例
const app = getApp()
// var API = require('../../utils/api.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
	page_num: 1,
	page_size: 2,
	total_num: 0,
	is_all: false,
	//视频列表
	videoList: [
		// {
		// 	courseImgUrl: '../../images/course/course1.png',
		// 	courseName: '甲状腺疾病',
		// 	doctor: [
		// 		{
		// 			doctorName: '张玲',
		// 			doctorHospital: '北京协和医院',
		// 			jobTitle: '内分泌科甲状腺颈部外科,内分泌科甲状腺颈部外科'
		// 		} 
		// 	],
		// 	courseNumber: '3节课',
		// 	coursePrice: '2000',
		// 	courseTip: '3000人已经购买'
		// },
		// {
		// 	courseImgUrl: '../../images/course/course2.png',
		// 	courseName: '预防内分泌疾病需要做的几点注意事项',
		// 	doctor: [
		// 		{
		// 			doctorName: '刘晓莉',
		// 			doctorHospital: '首都医科大学附属院北京妇产',
		// 			jobTitle: '内分泌科 主任医师'
		// 		}
		// 	],
		// 	courseNumber: '3节课',
		// 	coursePrice: '8900',
		// 	courseTip: '366700人已经购买'
		// },
		// {
		// 	courseImgUrl: '../../images/course/course3.png',
		// 	courseName: '引起头痛的五大疾病',
		// 	doctor: [
		// 		{
		// 			doctorName: '王雪',
		// 			doctorHospital: '北京协和医院',
		// 			jobTitle: '神经内科 副主任医师等3人'
		// 		}
		// 	],
		// 	courseNumber: '3节课',
		// 	coursePrice: '500',
		// 	courseTip: '34500人已经购买'
		// }
	]
  	},
    //分享函数
  	onShareAppMessage: function (ops) {
	  	if(ops.from === 'button'){
		  	// 来自页面内转发按钮
	  	}
	  	return {
		  	title: '顾氏珺安健康课堂',
		  	path: 'pages/index/index',
		  	success: function (res) {
			  	// 转发成功
			  	console.log("转发成功:" + JSON.stringify(res));
		  	},
		  	fail: function (res) {
			  	// 转发失败
			  	console.log("转发失败:" + JSON.stringify(res));
		  	}
	  	}
  	},
    bindViewTap: function() {
    	wx.navigateTo({
      		url: '../logs/logs'
    	})
    },
  	navigateToLessons: function (event){
		let class_group_id = event.currentTarget.dataset.class_group_id;
		let doctor_num = event.currentTarget.dataset.doctor_num;
		wx.navigateTo({
			url: '../lessons/lessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
		})
  	},
	//上拉加载
	onReachBottom(){
		var self = this;
		if(this.data.total_num == this.data.videoList.length){
			self.setData({
				'is_all': true
			})
			return;
		}else{
			//查询套课
			var self = this,
				_param = {
					page_num: self.data.page_num,
					page_size: self.data.page_size
				},
				sign = wx.getStorageSync('sign');
			wx.showLoading({
				title: '加载中',
			})
			wx.request({
				url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
				method: 'POST',
				header: {
					sign: sign
				},
				data: {
					methodName: 'sp_hc_class_group_app_query',
					param: JSON.stringify(_param)
				},
				success: function (res) {
					if (res.data.data.total_num) {
						wx.setStorageSync('sign', res.data.sign)
						self.setData({
							'videoList': self.data.videoList.concat(res.data.data.rows),
							'page_num': self.data.page_num + 1,
						})
						wx.hideLoading();
					}
				}
			})
		}
        console.log('is_all', this.data.is_all)
	},
  	onLoad: function () {
	  	var self = this,
		videoList = [],
		param = {
			page_num: 1,
		 	page_size: 5
		},
		sign = wx.getStorageSync('sign');
		wx.request({
			url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
			method: 'POST',
			header: {
				sign: sign
			},
			data: {
				methodName: 'sp_hc_banner_query',
				param: JSON.stringify(param)
			},
			success: function(res){
				if (res.data.data.total_num){
					wx.setStorageSync('sign', res.data.sign)
					var banners = [];
					res.data.data.rows.forEach(function(item, index, array){
						banners.push(item.resources_url);
					})
					self.setData({
						'imgPro.imgUrls': banners,
					})
				}

				//查询套课
				var _param = {
					page_num: 1,
					page_size: 3
				};
				wx.request({
					url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
					method: 'POST',
					header: {
						sign: sign
					},
					data: {
						methodName: 'sp_hc_class_group_app_query',
						param: JSON.stringify(_param)
					},
					success: function(res){
						if(res.data.data.total_num){
							wx.setStorageSync('sign', res.data.sign)
							self.setData({
								'videoList': res.data.data.rows,
								'total_num': res.data.data.total_num,
								'page_num': self.data.page_num + 1,
								'page_size': 3
							})
						}
					}
				})
			},
            fail: function (res){
                wx.navigateTo({
                    url: '../ notfound / notfound '
                })
            }
		})
		
	  	// API.ajax('', function (res) {
		//   	//这里既可以获取模拟的res
		// 	videoList = res.data.videoList;
		// 	videoList.forEach(function(item,index,array){
		// 		var doctors = [];
		// 		item.lessons.forEach(function(_item, _index, array){
		// 			if(doctors.indexOf(_item.doctorId)){
		// 				doctors.push({
		// 					doctorId: _item.doctorId, 
		// 					doctorName: _item.doctorName, 
		// 					doctorHospital: _item.doctorHospital, 
		// 					jobTitle: _item.jobTitle,
		// 					isHostest: _item.isHostest,
		// 					isFamous: _item.isFamous,
		// 					isCareful: _item.isCareful,
		// 					doctorImg: _item.doctorImg,
		// 					goodAt: _item.goodAt
		// 				})
		// 			}
		// 		})
		// 		item.doctors = doctors;
		// 	})
		//   	self.setData({
		// 		'imgPro.imgUrls': res.data.imgUrls,
		// 		'videoList': videoList
		//   	})
		// 	wx.setStorage({
		// 		key: 'videoList',
		// 		data: videoList,
		// 	})
	  	// });
    	if (app.globalData.userInfo) {
    	  	this.setData({
    	    	userInfo: app.globalData.userInfo,
    	    	hasUserInfo: true
    	  	})
    	} else if (this.data.canIUse){
    	  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    	  // 所以此处加入 callback 以防止这种情况
    	  app.userInfoReadyCallback = res => {
    	    this.setData({
    	      userInfo: res.userInfo,
    	      hasUserInfo: true
    	    })
    	  }
    	} else {
    	    // 在没有 open-type=getUserInfo 版本的兼容处理
    	    wx.getUserInfo({
    	        success: res => {
    	            app.globalData.userInfo = res.userInfo
    	                this.setData({
    	                userInfo: res.userInfo,
    	                hasUserInfo: true
    	            })
    	        }
    	    })
    	}
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
