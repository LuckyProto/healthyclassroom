// pages/notify/notify.js
var app = getApp();
Page({
    data: {
        userInfo: null,
		purchased: 34,
		storeNumber: 67,
		purchaesTab: true,
		storedTab: false,
		//已购买列表
		purchaesdList: [
			{
				courseImgUrl: '../../images/index/u4.png',
				courseName: '甲状腺疾病',
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
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
	userInfoHandler: function(event){
		console.log(event)
		wx.request({
			url: 'http//10.20.0.84:8080/hservice/otherUserLogin', //仅为示例，并非真实的接口地址
			data: {
				'cname': event.detail.userInfo.nickName,
				'pwd': '123456',
				'csource': 'wechat'
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data)
			}
		})
		this.setData({
			userInfo: event.detail.userInfo
		})
	}
})