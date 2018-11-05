//pages/notify/notify.js
const util = require('../../utils/util.js')
var app = getApp();
Page({
    data: {
        isiOS                   : false,
        //请求接口
        order_query_methodName  : 'sp_hc_credential_order_group_query',
        app_bought_methodName   : 'sp_hc_class_group_app_bought_query',
        collect_query_methodName: 'sp_hc_class_group_collect_query',
        app_collect_query_methodName: 'sp_hc_class_group_app_collect_query',
        //用户信息
        userInfo            :null,

        //已购买列表
        purchaesdList       :[],
		purchasedCount      :0,
        purchaesTab         :true,
		
		//已收藏列表
        storedIds           :[],
		storedList          :[],
        storeNumber         :0,
        storedTab           :false,
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
    onLoad: function () {
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
    //监听页面加载
    onShow: function (options) {
        var self = this;
        if(app.globalData.userInfo){
            self.setData({
                userInfo: app.globalData.userInfo
            })
        }
        if (self.data.userInfo){
            //获取购买的套课id
            var _param = {
                    methodName: "sp_hc_credential_order_group_query"
                },
                sign = wx.getStorageSync('sign');
            util.fetchData(self.data.order_query_methodName, _param, function (data) {
                var purchasedList = [];
                if (data) {
                    data.forEach(function (item, index, array) {
                        if (purchasedList.indexOf(item.class_group_id) == -1) {
                            purchasedList.push(item.class_group_id);
                        }
                    })
                }
                wx.setStorageSync('purchasedList', purchasedList)
            })
            var bought_param = {
                "methodName": "sp_hc_class_group_app_bought_query"
            }
            util.fetchData(self.data.app_bought_methodName, bought_param, function (data) {
                self.setData({
                    purchaesTab: true,
                    storedTab: false,
                    purchaesdList: data.rows,
                    purchasedCount: data.total_num
                })
            })

            //获取收藏的套课
            var collect_ids_param = {
                "methodName": "sp_hc_class_group_collect_query"
            }
            util.fetchData(self.data.collect_query_methodName, collect_ids_param, function (data) {
                var storedIds = [];
                if (data) {
                    data.forEach(function (item, index, array) {
                        storedIds.push(item.class_group_id)
                    })
                }
                self.setData({
                    storedIds: storedIds
                })
            })
            var collect_param = {
                "methodName": "sp_hc_class_group_app_collect_query"
            }
            util.fetchData(self.data.app_collect_query_methodName, collect_param, function (data) {
                self.setData({
                    purchaesTab: true,
                    storedTab: false,
                    storedList: data.rows,
                    storeNumber: data.total_num
                })
            })
        }
    },
    navigateToLessons: function (event) {
        let class_group_id = event.currentTarget.dataset.class_group_id;
        let doctor_num = event.currentTarget.dataset.doctor_num;
        wx.navigateTo({
            url: '../lessons/lessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
        })
    },
    navigateToPurchaseLessons: function (event) {
        let class_group_id = event.currentTarget.dataset.class_group_id;
        let doctor_num = event.currentTarget.dataset.doctor_num;
        wx.navigateTo({
            url: '../lessons/lessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
        })
    },
	userInfoHandler: function(event){
        if (event.detail.errMsg != 'getUserInfo:ok') return;
        var self = this;
        try {
            wx.setStorageSync('userInfo', event.detail.userInfo)
            this.setData({
                userInfo: event.detail.userInfo
            })
            app.globalData.userInfo =  event.detail.userInfo
            
            var _param = {
                methodName: "sp_hc_credential_order_group_query"
            },
            sign = wx.getStorageSync('sign');
            //获取购买的套课id
            util.fetchData(self.data.order_query_methodName, _param, function (data) {
                var purchasedList = [];
                if (data) {
                    data.forEach(function (item, index, array) {
                        if (purchasedList.indexOf(item.class_group_id) == -1) {
                            purchasedList.push(item.class_group_id);
                        }
                    })
                }
                wx.setStorageSync('purchasedList', purchasedList)
            })
            //获取购买的套课
            var bought_param = {
                "methodName": "sp_hc_class_group_app_bought_query"
            }
            util.fetchData(self.data.app_bought_methodName, bought_param, function (data) {
                self.setData({
                    purchaesTab: true,
                    storedTab: false,
                    purchaesdList: data.rows,
                    purchasedCount: data.total_num
                })
            })
            //获取收藏的套课
            var collect_ids_param = {
                "methodName": "sp_hc_class_group_collect_query"
            }
            util.fetchData(self.data.collect_query_methodName, collect_ids_param, function (data) {
                var storedIds = [];
                if(data){
                    data.forEach(function(item, index, array){
                        storedIds.push(item.class_group_id)
                    })
                }
                self.setData({
                    storedIds: storedIds
                })
            })
            var collect_param = {
                "methodName": "sp_hc_class_group_app_collect_query"
            }
            util.fetchData(self.data.app_collect_query_methodName, collect_param, function (data) {
                self.setData({
                    purchaesTab: true,
                    storedTab: false,
                    storedList: data.rows,
                    storeNumber: data.total_num
                })
            })
        } catch (e) {
            wx.showToast({
                title: '系统提示:网络错误',
                icon: 'warn',
                duration: 5000,
            })
        }
	}
})