// pages/lessons/lessons.js
const md5 = require('../../utils/md5.js');
const util = require('../../utils/util.js')
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
        //请求接口
        class_group_app_find_methodName: 'sp_hc_class_group_app_find',

        class_group_id: undefined,
        doctor_num: undefined,
        purchaesTab: true,
        storedTab: false,
        doctorAmount: undefined,
        width_swiperWriper: undefined,
        count: 0,
        moveLeft: 0,
        canMoveAmount: 0,
        
        lesson: null,
        price: undefined,
        isStored: undefined,
        isPurchased: undefined,

        //分享
        isFromShare: false
    },
    /**
      * 组件的方法列表
      */
    methods: {
        onLoad: function (options) {
            console.log('pur', options)
            var self            = this,
                class_group_id  = options.class_group_id;
                
            self.setData({
                class_group_id: class_group_id,
            })


            if (options.isFromShare){
                var isFromShare = options.isFromShare;
                self.setData({
                    isFromShare: options.isFromShare
                })
            }
            
            var param = {
                    class_group_id: class_group_id,
                },
                sign = wx.getStorageSync('sign'),
                purchasedList = wx.getStorageSync('purchasedList');
            var purchased_id_list = [];
            if (purchasedList) {
                purchasedList.forEach(function (item, index, array) {
                    purchased_id_list.push(item.class_group_id);
                })
            }

            if (purchased_id_list.indexOf(Number(class_group_id)) != -1) {
                self.setData({
                    isPurchased: false
                })
            } else {
                self.setData({
                    isPurchased: false
                })
            }

            if (options.isFromShare){
                wx.redirectTo({
                    url: '../lessons/lessons?class_group_id=' + self.data.class_group_id + '&isFromShare=' + this.data.isFromShare
                })
            } else{
                util.fetchData(self.data.class_group_app_find_methodName, param, function (data) {
                    self.setData({
                        class_group_id: class_group_id,
                        doctor_num: options.doctor_num,
                        lesson: data,
                        price: data.price / 100
                    })
                    wx.setStorageSync('purclassList', data.classList)
                    var doctors = [],
                        doctors_id = [];
                    data.classList.forEach(function (item, index, array) {
                        if (doctors_id.indexOf(item.docInfo.doctor_id) == -1) {
                            doctors_id.push(item.docInfo.doctor_id);
                            doctors.push(item.docInfo);
                        }
                    })
                    // wx.setStorageSync('doctors', doctors)
                    self.setData({
                        'lesson.doctors': doctors,
                        doctorAmount: doctors.length,
                        width_swiperWriper: doctors.length * 632,
                        canMoveAmount: doctors.length
                    })
                })
            }
        },
        onShareAppMessage: function (ops) {
            console.log(this.data.isFromShare)
            // util.onShareAppMessage(this.data.class_group_id)
            var self = this;
            if (ops.from === 'button') {
                // 来自页面内转发按钮
            }

            self.setData({
                isFromShare: true
            })
            console.log(this.data.isFromShare)
            return {
                title: '顾氏珺安健康课堂',
                path: 'pages/purlessons/purlessons?class_group_id=' + self.data.class_group_id + '&isFromShare=' + self.data.isFromShare + '&doctor_num=' + self.data.doctorAmount,
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
        navigateToDoctor: function (event) {
            var doctorid = event.currentTarget.dataset.doctorid;
            wx.navigateTo({
                url: '../doctor/doctor?doctorid=' + doctorid + '&class_group_id=' + this.data.class_group_id
            })
        },
        navigateToLesson: function (event) {
            console.log(event)
            var class_id = event.currentTarget.dataset.class_id;
            var idx      = event.currentTarget.dataset.idx;
            wx.navigateTo({
                url: '../purlesson/purlesson?class_id=' + class_id + '&isPurchased=' + this.data.isPurchased + '&price=' + this.data.price + '&class_group_id=' + this.data.class_group_id + '&idx=' + idx + '&lessonCount=' + this.data.lesson.classList.length
            })
        },
        handleTarchStart: function (event) {
            this.data.startX = event.touches[0].pageX;
        },
        handleTarchEnd: function (event) {
            var self = this,
                eachMoveX = 632,	//每次移动距离	
                moveX = 0,  		//移动距离
                step = 79;			//移动步长
            this.data.endX = event.changedTouches[0].pageX;
            if (this.data.endX < this.data.startX) {
                if (Math.abs(this.data.count) < this.data.canMoveAmount - 1) {
                    self.data.count = self.data.count - 1;
                    var timer = setInterval(function () {
                        if (moveX >= 632) {
                            clearInterval(timer)
                        } else {
                            moveX = moveX + step;
                            self.setData({
                                moveLeft: self.data.moveLeft - step
                            })
                        }
                    }, 50)
                }
            } else {
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
                    }, 50)
                }
            }
        },
        collectionFun: function () {
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
        }
    }
})
