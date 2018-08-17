// pages/notify/notify.js
var app = getApp();
Page({
    data: {
        userInfo: null,
		purchasedCount: 0,
		storeNumber: 67,
		purchaesTab: true,
		storedTab: false,
		//已购买列表
		purchaesdList: [
			// {
			// 	courseImgUrl: '../../images/index/u4.png',
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
			// 	courseImgUrl: '../../images/index/u4.png',
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
			// 	courseImgUrl: '../../images/index/u4.png',
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
		],
		//已收藏列表
		storedList: [
			{
				courseImgUrl: '../../images/index/u4.png',
				courseName: '高血压',
				doctor: [
					{
						doctorName: '张玲',
						doctorHospital: '北京协和医院',
						jobTitle: '内分泌科甲状腺颈部外科,内分泌科甲状腺颈部外科'
					}
				],
				courseNumber: '3节课',
				coursePrice: '2000',
				courseTip: '3000人已经购买'
			},
			{
				courseImgUrl: '../../images/index/u4.png',
				courseName: '预防内分泌疾病需要做的几点注意事项',
				doctor: [
					{
						doctorName: '刘晓莉',
						doctorHospital: '首都医科大学附属院北京妇产',
						jobTitle: '内分泌科 主任医师'
					}
				],
				courseNumber: '3节课',
				coursePrice: '8900',
				courseTip: '366700人已经购买'
			},
			{
				courseImgUrl: '../../images/index/u4.png',
				courseName: '引起头痛的五大疾病',
				doctor: [
					{
						doctorName: '王雪',
						doctorHospital: '北京协和医院',
						jobTitle: '神经内科 副主任医师等3人'
					}
				],
				courseNumber: '3节课',
				coursePrice: '500',
				courseTip: '34500人已经购买'
			}
		]
    },
	changePurchaseTab: function (event) {
		this.setData({
			purchaesTab: true,
			storedTab: false
		})
	},
	changeStoredTab: function(){
		this.setData({
			purchaesTab: false,
			storedTab: true
		})
	},
    //监听页面加载
    onLoad: function (options) {
        // this.setData({
        //     userInfo: app.globalData.userInfo
        // })
    },
    navigateToLessons: function (event) {
        let class_group_id = event.currentTarget.dataset.class_group_id;
        let doctor_num = event.currentTarget.dataset.doctor_num;
        wx.navigateTo({
            url: '../purlessons/purlessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
        })
    },
	userInfoHandler: function(event){
        var self = this;
        try {
            wx.setStorageSync('userInfo', event.detail.userInfo)
            this.setData({
                userInfo: event.detail.userInfo
            })
            var _param = {
                methodName: "sp_hc_credential_order_group_query"
            },
            sign = wx.getStorageSync('sign');
            wx.request({
                url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
                method: 'POST',
                header: {
                    sign: sign
                },
                data: {
                    methodName: 'sp_hc_credential_order_group_query',
                    param: JSON.stringify(_param)
                },
                success: function (res) {
                    wx.setStorageSync('sign', res.data.sign)
                    var purchasedList = [];
                    if (res.data.data){
                        res.data.data.forEach(function(item, index, array){
                            if (purchasedList.indexOf(item.class_group_id) == -1){
                                purchasedList.push(item.class_group_id);
                            }
                        })
                    }
                    wx.setStorageSync('purchasedList', purchasedList)
                    // wx.navigateTo({
                    // 	url: 'index'
                    // })
                    wx.request({
                        url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
                        method: 'POST',
                        header: {
                            sign: sign
                        },
                        data: {
                            methodName: 'sp_hc_class_group_app_bought_query',
                            param: JSON.stringify({"methodName":"sp_hc_class_group_app_bought_query"})
                        },
                        success: function (res) {
                            wx.setStorageSync('sign', res.data.sign)
                            self.setData({
                                purchaesTab     : true,
                                storedTab       : false,
                                purchaesdList   : res.data.data.rows,
                                purchasedCount  : res.data.data.total_num
                            })
                        }
                    })
                }
            })
        } catch (e) {
            wx.showToast({
                title: '系统提示:网络错误',
                icon: 'warn',
                duration: 1500,
            })
        }
		// wx.request({
		// 	url: 'http//10.20.0.84:8080/hservice/otherUserLogin', //仅为示例，并非真实的接口地址
		// 	data: {
		// 		'cname': event.detail.userInfo.nickName,
		// 		'pwd': '123456',
		// 		'csource': 'wechat'
		// 	},
		// 	header: {
		// 		'content-type': 'application/json' // 默认值
		// 	},
		// 	success: function (res) {
		// 		console.log(res.data)
		// 	}
		// })
	}
})