// pages/lessons/lessons.js
const app = getApp()
const md5 = require('../../utils/md5.js')
const util = require('../../utils/util.js')
Page({
    /**
    * 组件的初始数据
    */
  	data: {
        isiOS                       : false, //设备信息
        isLogin                     : false,
        //请求接口
        class_group_find_methodName : 'sp_hc_class_group_app_find',
        order_query_methodName      : 'sp_hc_credential_order_group_query',
        collect_query_methodName    : 'sp_hc_class_group_collect_query',
        collect_save_methodName     : 'sp_hc_class_group_collect_save',
        collect_del_methodName      : 'sp_hc_class_group_collect_del',
        order_no_methodName         : 'hc_order_no',        //订单号
        order_save_methodName       : 'sp_hc_order_save',   //保存订单
        
        hidden                      : false,     //加载样式
        //套课Id
		class_group_id      : undefined,
        lesson              : null,
        isBuy               : 0,
        isCollect           : 0,
		purchaesTab         : true,
		storedTab           : false,
        //移动参数
		doctorAmount        : undefined,
		width_swiperWriper  : undefined,
		count               : 0,
		moveLeft            : 0,
		canMoveAmount       : 0
  	},
  	/**
   	* 组件的方法列表
   	*/
        onLoad: function (options) {
            var self = this;
            self.setData({
                class_group_id: Number(options.class_group_id)
            })
            //获取课程信息
            var param = {
                class_group_id: self.data.class_group_id,
            };
            util.fetchData(self.data.class_group_find_methodName, param, function (data) {
                //课程信息
                self.setData({
                    lesson: data
                })
                
                wx.setStorageSync('classList', data.classList)
                //医生信息
                var doctors = [],
                    doctors_id = [];
                data.classList.forEach(function (item, index, array) {
                    if (doctors_id.indexOf(item.docInfo.doctor_id) == -1) {
                        doctors_id.push(item.docInfo.doctor_id)
                        doctors.push(item.docInfo);
                    }
                })
                wx.setStorageSync('doctors', doctors)
                self.setData({
                    'lesson.doctors': doctors,
                    doctorAmount: doctors.length,
                    width_swiperWriper: doctors.length * 632,
                    canMoveAmount: doctors.length
                })
                self.setData({
                    hidden: true
                });
            })
        },
        onShow: function(){
            var self = this;
            //是否处于登录状态
            if (app.globalData.userInfo) {
                this.setData({
                    isLogin : true
                })
            } else {
                util.login(app);
            }

            // self.setData({
            //     hidden: false
            // });
            
            //获取购买套课的ID
            var _param = {
                methodName: "sp_hc_credential_order_group_query"
            },
                sign = wx.getStorageSync('sign');
            util.fetchData(self.data.order_query_methodName, _param, function (data) {
                var boughtIds = [];
                if (data) {
                    data.forEach(function (item, index, array) {
                        if (~!boughtIds.indexOf(item.class_group_id)) {
                            boughtIds.push(item.class_group_id)
                        }
                    })
                    if (boughtIds.indexOf(self.data.class_group_id) != -1) {
                        self.setData({
                            isBuy: 1
                        })
                    } else {
                        self.setData({
                            isBuy: 0
                        })
                    }
                }
            })
            //获取收藏的套课ID
            var collect_ids_param = {
                "methodName": "sp_hc_class_group_collect_query"
            }
            util.fetchData(self.data.collect_query_methodName, collect_ids_param, function (data) {
                var collectIds = [];
                if (data) {
                    data.forEach(function (item, index, array) {
                        if (~!collectIds.indexOf(item.class_group_id)){
                            collectIds.push(item.class_group_id)
                        }
                    })
                    if (collectIds.indexOf(self.data.class_group_id) != -1) {
                        self.setData({
                            isCollect: 1
                        })
                    } else {
                        self.setData({
                            isCollect: 0
                        })
                    }
                }
                // self.setData({
                //     hidden: true
                // });
            })
        },
        onShareAppMessage: function (ops) {
            var self = this;
            if (ops.from === 'button') {
                // 来自页面内转发按钮
            }
            return {
                title: '悦讲健康',
                path: 'pages/lessons/lessons?class_group_id=' + self.data.class_group_id,
                success: function (res) {
                    //转发成功
                },
                fail: function (res) {
                    //转发失败
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
            var idx = event.currentTarget.dataset.idx;
            wx.navigateTo({
                url: '../lesson/lesson?class_id=' + class_id  + '&price=' +( this.data.lesson.price / 100 ) + '&class_group_id=' + this.data.class_group_id + '&title=' + this.data.lesson.title + '&idx=' + idx + '&lessonCount=' + this.data.lesson.classList.length
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
    //给变登录状态
    onChangeLoginState: function(e){
        this.setData({
            isLogin: e.detail.isLogin
        })
    }
})
