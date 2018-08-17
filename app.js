//app.js
App({
  	onLaunch: function () {
    	//展示本地存储能力
    	// var logs = wx.getStorageSync('logs') || []
    	// logs.unshift(Date.now())
    	// wx.setStorageSync('logs', logs)
    	//登录
    	wx.login({
      		success: res => {
					if (res.code) {
						var param = {
							code: res.code
						};
                        console.log('code', res.code)
						// var code = res.code;
						// wx.request({
            //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb27a790cd5cbda0b&secret=0931ab71f720c1741f2200ba9016ef48&js_code=' + code + '&grant_type=authorization_code',
						// 	data: {},
						// 	header: {
						// 		'content-type': 'application/json'
						// 	},
						// 	success: function (res) {
						// 		console.log(res)
						// 		// openid = res.data.openid
            //     var openid = "okpQB0XIpDuxOO4iBjp-Af3B-Cgg";
						// 	},
						// 	fail: function(res){
						// 		console.log(res)
						// 	}
						// })
						//发起网络请求
						wx.request({
							url: 'https://class-dev.gusmedsci.cn/hservice-wx/wechatLogin',
							method: 'POST',
							data: JSON.stringify(param),
							success: function (res) {
								if(res.data.code == 0){
									wx.setStorageSync('sign', res.data.sign)
                                    wx.navigateTo({
                                        url: 'index'
                                    })
									// var _param = {
									// 		methodName: "sp_hc_credential_order_group_query"
									// 	},
									// 	sign = res.data.sign;
									// wx.request({
									// 	url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
									// 	method: 'POST',
									// 	header: {
									// 		sign: sign
									// 	},
									// 	data: {
									// 		methodName: 'sp_hc_credential_order_group_query',
									// 		param: JSON.stringify(_param)
									// 	},
									// 	success: function (res) {
									// 		wx.setStorageSync('purchasedList', res.data.data)
									// 		wx.navigateTo({
									// 			url: 'index'
									// 		})
									// 	}
									// })
								}
							}
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
        		//发送 res.code 到后台换取 openId, sessionKey, unionId
      		}
    	})
    // 获取用户信息
	// wx.getSetting({
	// 	withCredentials: true,
    //   	success: res => {
    //     	if (res.authSetting['scope.userInfo']) {
    //       		// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       		wx.getUserInfo({
    //         		success: res => {
	// 					console.log(res)
    //           			// 可以将 res 发送给后台解码出 unionId
    //           			this.globalData.userInfo = res.userInfo;
	// 		  			this.globalData.encryptedData = res.encryptedData;
    //           			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           			// 所以此处加入 callback 以防止这种情况
    //           			if (this.userInfoReadyCallback) {
    //             			this.userInfoReadyCallback(res)
    //           			}
    //         		}
    //       		})
    //     	}else{
	// 			wx.authorize({
	// 				scope: 'scope.record',
	// 				success: res => {
	// 					wx.startRecord()
	// 				}
	// 			})
	// 		}
    //   	}
    // })
  	},
  	globalData: {
		sign: undefined,
    	userInfo: null,
		encryptedData: null
  	}
})