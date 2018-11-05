const app = getApp();
const md5 = require('../../utils/md5.js');
const util = require('../../utils/util.js');

Component({
    properties: {
        //这里定义了属性，属性值可以在组件使用时指定
        isLogin: {
            type    : Boolean,
            value   : false
        },
        isFromShare: {
            type: Boolean,
            value: false
        },
        class_group_id: {
            type: Number,
            value: 0
        },
        title: {
            type: String,
            value: 0
        },
        isBuy: {
            type: Number,
            value: 0
        },
        isCollect: {
            type: Number,
            value: 0
        },
        coursePrice: {
            type: Number,
            value: 1000
        }
    },
    data: {
        isiOS                           : true,    //设备信息
        //请求接口
        order_query_methodName          : 'sp_hc_credential_order_group_query', //购买列表
        class_group_find_methodName     : 'sp_hc_class_group_app_find',         //购买的套课
        collect_save_methodName         : 'sp_hc_class_group_collect_save',     //收藏
        collect_del_methodName          : 'sp_hc_class_group_collect_del',      //取消收藏
        order_no_methodName             : 'hc_order_no',        //订单号
        order_save_methodName           : 'sp_hc_order_save',   //保存订单

        class_group_id  : 0,
        title           : undefined,
        coursePrice     : 0,
        isBuy           : 0,
        isCollect       : 0
    },
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        ready: function (event) {
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
            if (this.properties.isFromShare){
                isFromShare: this.properties.isFromShare
            }
            self.setData({
                class_group_id  : this.properties.class_group_id,
                title           : this.properties.title,
                coursePrice     : this.properties.coursePrice,
                isBuy           : this.properties.isBuy,
                isCollect       : this.properties.isCollect
            })
            // var timer = setInterval(function(){
            //     if (app.globalData.lesson){
            //         clearInterval(timer)
            //         self.setData({
            //             class_group_id  : app.globalData.lesson.class_group_id,
            //             title           : app.globalData.lesson.title,
            //             coursePrice     : app.globalData.lesson.price / 100,
            //             isBuy           : app.globalData.lesson.is_buy,
            //             isCollect       : app.globalData.lesson.is_collect
            //         })
            //     }
            // }, 1000)
        }
    },
    methods: {
        //获取用户信息
        userInfoHandler: function (event) {
            if (event.detail.errMsg != 'getUserInfo:ok') return;
            var self = this;
            try {
                app.globalData.userInfo = event.detail.userInfo;
                var myEventDetail = {
                    isLogin: event.detail.userInfo ? true : false
                }
                // detail对象，提供给事件监听函数
                this.triggerEvent('changeLoginState', myEventDetail);
                //登录
                
            } catch (e) {
                wx.showToast({
                    title   : '系统提示:网络错误',
                    icon    : 'warn',
                    duration: 6000,
                })
            }
        },
        //收藏
        collectionFun: function () {
            var self = this,
                collect_param = {
                    class_group_id: this.data.class_group_id
                };
            util.fetchData(!this.properties.isCollect ? this.data.collect_save_methodName : this.data.collect_del_methodName, collect_param, function (data) {
                if (data.UID) {
                    wx.showToast({
                        title: '取消收藏',
                    })
                } else {
                    wx.showToast({
                        title: '收藏成功',
                    })
                }
                self.setData({
                    isCollect: !self.properties.isCollect
                })
                // self.triggerEvent('changeCollectState')
            })
        },
        //购买
        fun_buy: function () {
            var self = this;
            //获取订单编号
            var orderNumParam = {
                methodName: self.data.order_no_methodName
            }
            util.fetchData(self.data.order_no_methodName, orderNumParam, function (data) {
                var order_no = data.no,
                    //获取下单id
                    pay_param = {
                        order_no        : order_no,
                        credential_id   : 1,
                        price           : self.data.coursePrice * 100,
                        pay_source      : "wechat",
                        remark          : '',
                        groupList: [
                            { class_group_id: self.data.class_group_id }
                        ]
                    };
                util.fetchData(self.data.order_save_methodName, pay_param, function (data) {
                    //下单
                    var orderParam = {
                        body        : self.properties.title,
                        order_no    : order_no,
                        price       : self.data.coursePrice * 100,
                        openid      : app.globalData.openid
                    };
                    util.wxPay(orderParam, function (data) {
                        //加密
                        var paySignStr = 'appId=' + data.appId + '&nonceStr=' + data.nonceStr + '&package=' + data.package + '&signType=MD5&timeStamp=' + data.timeStamp + '&key=IZpPC8F7gx95kSdWpnfEi0MV3eReYPx1';
                        var paySign = md5.hex_md5(paySignStr).toUpperCase();

                        //支付
                        var requestPaymentParam = {
                            'timeStamp' : data.timeStamp,
                            'nonceStr'  : data.nonceStr,
                            'package'   : data.package,
                            'signType'  : 'MD5',
                            'paySign'   : paySign,
                        }
                        util.requestPayment(requestPaymentParam)
                    })
                })
            })
        }
    }
})