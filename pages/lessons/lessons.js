// pages/lessons/lessons.js
const md5 = require('../../utils/md5.js');
Component({
  /**
   * 组件的属性列表
   */
  	properties: {

  	},

  /**
   * 组件的初始数据
   */
  	data: {
		class_group_id      : undefined,
		doctor_num          : undefined,
		purchaesTab         : true,
		storedTab           : false,
		doctorAmount        : undefined,
		width_swiperWriper  : undefined,
		count               : 0,
		moveLeft            : 0,
		canMoveAmount       : 0,
		//已购买列表
		// purchaesdList: [
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '甲状腺疾病',
		// 		doctor: [
		// 			{
		// 				doctorName: '张玲',
		// 				doctorHospital: '北京协和医院',
		// 				jobTitle: '内分泌科甲状腺颈部外科,内分泌科甲状腺颈部外科'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '2000',
		// 		courseTip: '3000人已经购买'
		// 	},
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '预防内分泌疾病需要做的几点注意事项',
		// 		doctor: [
		// 			{
		// 				doctorName: '刘晓莉',
		// 				doctorHospital: '首都医科大学附属院北京妇产',
		// 				jobTitle: '内分泌科 主任医师'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '8900',
		// 		courseTip: '366700人已经购买'
		// 	},
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '引起头痛的五大疾病',
		// 		doctor: [
		// 			{
		// 				doctorName: '王雪',
		// 				doctorHospital: '北京协和医院',
		// 				jobTitle: '神经内科 副主任医师等3人'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '500',
		// 		courseTip: '34500人已经购买'
		// 	}
		// ],
		//已收藏列表
		// storedList: [
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '高血压',
		// 		doctor: [
		// 			{
		// 				doctorName: '张玲',
		// 				doctorHospital: '北京协和医院',
		// 				jobTitle: '内分泌科甲状腺颈部外科,内分泌科甲状腺颈部外科'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '2000',
		// 		courseTip: '3000人已经购买'
		// 	},
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '预防内分泌疾病需要做的几点注意事项',
		// 		doctor: [
		// 			{
		// 				doctorName: '刘晓莉',
		// 				doctorHospital: '首都医科大学附属院北京妇产',
		// 				jobTitle: '内分泌科 主任医师'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '8900',
		// 		courseTip: '366700人已经购买'
		// 	},
		// 	{
		// 		courseImgUrl: '../../images/index/u4.png',
		// 		courseName: '引起头痛的五大疾病',
		// 		doctor: [
		// 			{
		// 				doctorName: '王雪',
		// 				doctorHospital: '北京协和医院',
		// 				jobTitle: '神经内科 副主任医师等3人'
		// 			}
		// 		],
		// 		courseNumber: '3节课',
		// 		coursePrice: '500',
		// 		courseTip: '34500人已经购买'
		// 	}
		// ],
		lesson: null,
		price: undefined,
		isStored: undefined,
		isPurchased: undefined
  	},
  	/**
   	* 组件的方法列表
   	*/
  	methods: {
			onLoad: function (options) {
				var self = this;
				var class_group_id = options.class_group_id;
                self.setData({
                    class_group_id: class_group_id
                })
				var	param = {
						class_group_id: class_group_id,
					},
					// _param = {
					// 	methodName: "sp_hc_credential_order_group_query"
					// },
					sign = wx.getStorageSync('sign'),
					purchasedList = wx.getStorageSync('purchasedList');
				var purchased_id_list = [];
                if (purchasedList){
                    purchasedList.forEach(function (item, index, array) {
                        purchased_id_list.push(item.class_group_id);
                    })
                }
				
				if (purchased_id_list.indexOf(Number(class_group_id)) != -1) {
					self.setData({
						isPurchased: false
					})
				}else{
					self.setData({
						isPurchased: false
					})
				}
				// wx.request({
				// 	url: 'https://his-dev.gusmedsci.cn/hservice/comm',
				// 	method: 'POST',
				// 	header: {
				// 		sign: sign
				// 	},
				// 	data: {
				// 		methodName: 'sp_hc_credential_order_group_query',
				// 		param: JSON.stringify(_param)
				// 	},
				// 	success: function (res) {
				// 		console.log(res.data)
				// 	}
				// })
				wx.request({
					url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
					method: 'POST',
					header: {
						sign: sign
					},
					data: {
						methodName: 'sp_hc_class_group_app_find',
						param: JSON.stringify(param)
					},
					success: function (res) {
						var doctors = [];
						if (res.data.code == 0) {
							wx.setStorageSync('sign', res.data.sign)
							self.setData({
								class_group_id: class_group_id,
								doctor_num: options.doctor_num,
								lesson: res.data.data,
								price: res.data.data.price / 100
							})
							wx.setStorageSync('classList', res.data.data.classList)
							res.data.data.classList.forEach(function(item, index, array){
								if (doctors.length == 0) {
									doctors.push(item.docInfo);
								} else {
									doctors.forEach(function (_item, index, array) {
										if (_item.doctor_id == item.docInfo.doctor_id) {
											return;
										} else {
											doctors.push(item.docInfo);
										}
									})
								}
							})
							wx.setStorageSync('doctors', doctors)
							self.setData({
								'lesson.doctors': doctors,
								doctorAmount: doctors.length,
				 				width_swiperWriper: doctors.length * 632,
			 					canMoveAmount: doctors.length
							})
						}
					}
				})
				// wx.getStorage({
				// 	key: 'videoList',
				// 	success: function (res) {
				// 		res.data.forEach(function(value, index, array){
				// 			if(value.class_group_id == class_group_id){
				// 				console.log(value)
				// 				self.setData({
				// 					lesson: value,
				// 					class_group_id: value.class_group_id,
				// 					isStored: value.isStored,
				// 					doctorAmount: value.doctors.length,
				// 					width_swiperWriper: value.doctors.length * 632,
				// 					canMoveAmount: value.doctors.length
				// 				})
				// 			}
				// 		})
				// 	}
				// })
			},
			onShareAppMessage: function (ops) {
				if (ops.from === 'button') {
					// 来自页面内转发按钮
				}
				return {
					title: '顾氏珺安健康课堂',
					path: 'pages/lessons/lessons',
					success: function (res) {
						// 转发成功
					},
					fail: function (res) {
						// 转发失败
					}
				}
			},
 			changePurchaseTab: function (event) {
				this.setData({
					purchaesTab: true,
					storedTab: false
				})
			},
			changeStoredTab: function () {
				this.setData({
					purchaesTab: false,
					storedTab: true
				})
			},
			navigateToDoctorList: function (event) {
				wx.navigateTo({
					url: '../doctors/doctors?class_group_id=' + this.data.class_group_id
				})
			},
			navigateToDoctor:function(event){
				var doctorid = event.currentTarget.dataset.doctorid;
				wx.navigateTo({
					url: '../doctor/doctor?doctorid=' + doctorid + '&class_group_id=' + this.data.class_group_id
				})
			},
			navigateToLesson: function (event) {
				var class_id = event.currentTarget.dataset.class_id;
				wx.navigateTo({
                    url: '../lesson/lesson?class_id=' + class_id + '&isPurchased=' + this.data.isPurchased + '&price=' + this.data.price
				})
			},
			handleTarchStart: function(event){
				this.data.startX = event.touches[0].pageX;
			},
			handleTarchEnd: function (event){
				var self = this,
					eachMoveX = 632,	//每次移动距离	
					moveX = 0,  		//移动距离
					step = 79;			//移动步长
				this.data.endX = event.changedTouches[0].pageX;
					if(this.data.endX < this.data.startX) {
						if (Math.abs(this.data.count) < this.data.canMoveAmount-1) {
							self.data.count = self.data.count - 1;
							var timer = setInterval(function () {
								if (moveX >= 632){
									clearInterval(timer)
								}else{
									moveX = moveX + step;
									self.setData({
										moveLeft: self.data.moveLeft - step
									})
								}
							}, 40)
						}
					}else{
						if (this.data.count < 0) {
							self.data.count = self.data.count + 1;
							var timer = setInterval(function () {
								if (moveX >= 632) {
									clearInterval(timer)
								} else {
									moveX = moveX + step;
									self.setData({
										moveLeft: self.data.moveLeft + step
									})
								}
							}, 40)
						}
					}
			},
			collectionFun: function(){
				var lesson_IsStored = 'this.data.lesson.isStored';
				this.setData({
					isStored: !this.data.isStored,
				})
				this.setData({
					lesson_IsStored: this.data.isStored
				})
			},
			onGotUserInfo: function (e) {
				console.log(e.detail.errMsg)
				console.log(e.detail.userInfo)
				console.log(e.detail.rawData)
			},
			fun_buy: function(){
				console.log('buy')
                var userInfo = wx.getStorageSync('userInfo')
                if (!userInfo){
                    wx.showToast({
                        title: '未防止重复购买，请到‘我的’进行登录后在购买',
                        icon: 'none',
                        duration: 10000
                    })

                    setTimeout(function () {
                        wx.hideToast()
                    }, 5000)
                }else{
                    var purchasedList = wx.getStorageSync('purchasedList');
                    console.log(typeof this.data.class_group_id, typeof purchasedList[0])
                    if (purchasedList.indexOf(Number(this.data.class_group_id)) != -1){
                        wx.showToast({
                            title: '已经购买过此课程，请后退到‘我的-已购买’中进行观看',
                            icon: 'none',
                            duration: 10000
                        })
                    }else{
                        var self = this;
                        var sign = wx.getStorageSync('sign');
                        wx.request({
                            url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
                            method: 'POST',
                            header: {
                                sign: sign
                            },
                            data: {
                                methodName: 'hc_order_no'
                            },
                            success: function (res) {
                                if (res.data.code == 0) {
                                    wx.setStorageSync('sign', res.data.sign)
                                    var order_no = res.data.data.no;
                                    var pay_param = {
                                        order_no: res.data.data.no,
                                        credential_id: 1,
                                        price: self.data.price * 100,
                                        pay_source: "wechat",
                                        remark: '',
                                        groupList: [
                                            { class_group_id: self.data.class_group_id }
                                        ]
                                    },
                                        _sign = wx.getStorageSync('sign');
                                    wx.request({
                                        url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
                                        method: 'POST',
                                        header: {
                                            sign: _sign
                                        },
                                        data: {
                                            methodName: 'sp_hc_order_save',
                                            param: JSON.stringify(pay_param)
                                        },
                                        success: function (res) {
                                            wx.setStorageSync('sign', res.data.sign)
                                            var orderSign = wx.getStorageSync('sign');
                                            console.log('orderSign', orderSign)
                                            var orderParam = {
                                                body: self.data.lesson.title,
                                                order_no: order_no,
                                                price: self.data.price * 100,
                                                openid: "okpQB0XIpDuxOO4iBjp-Af3B-Cgg"
                                            };
                                            wx.request({
                                                url: 'https://class-dev.gusmedsci.cn/hservice-wx/appletOrder',
                                                method: 'POST',
                                                header: {
                                                    sign: orderSign
                                                },
                                                data: JSON.stringify(orderParam),
                                                success: function (res) {
                                                    wx.setStorageSync('sign', res.data.sign)
                                                    console.log(JSON.parse(res.data.data))
                                                    var payObj = JSON.parse(res.data.data);
                                                    var paySignStr = 'appId=' + payObj.appId + '&nonceStr=' + payObj.nonceStr + '&package=' + payObj.package + '&signType=MD5&timeStamp=' + payObj.timeStamp + '&key=IZpPC8F7gx95kSdWpnfEi0MV3eReYPx1';
                                                    var paySign = md5.hex_md5(paySignStr).toUpperCase();

                                                    console.log('paySign', paySign, '22D9B4E54AB1950F51E0649E8810ACD6');
                                                    wx.requestPayment({
                                                        'timeStamp': payObj.timeStamp,
                                                        'nonceStr': payObj.nonceStr,
                                                        'package': payObj.package,
                                                        'signType': 'MD5',
                                                        'paySign': paySign,
                                                        'success': function (res) {
                                                            console.log('succ', res)
                                                        },
                                                        'fail': function (res) {
                                                            console.log('fail', res)
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
			}
  	}
})
