// pages/lessons/lessons.js
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
        class_courseware_query_methodName: 'sp_hc_class_courseware_query',
        class_find_methodName: 'sp_hc_class_find',
        doctor_find_methodName: 'sp_hc_doctor_find',

        //课程
        class_id: undefined,
        lesson: null,
        idx: undefined,   //课程序号
        lessonCount: undefined,    //套课内课程数量
        price: 0,

        //医生
        doctor: null,

        //课件
        courseWares: undefined,
        courseWareSrc: undefined,
        courseWaresCount: 0,
        courseWaresWiperWidth: 0,  

        isPurchased: undefined,

        //是否来自分享
        isFromShare: false,

        //移动
        startX: 0,     //移动初始位置
        endX: 0,     //移动结束位置
        moveLeft: 0,     //移动到的位置
        canMoveCount: 0,     //可以移动的次数
        movedCount: 0,     //已经移动的次数
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad: function (options) {
            console.log('purl', options)
            
            var self = this;
            var class_id = options.class_id;
            var class_group_id = options.class_group_id;
            var isPurchased = options.isPurchased;
            var price = options.price;
            self.setData({
                class_group_id: class_group_id,
                class_id: class_id,
                price: price,
                idx: options.idx,
                lessonCount: options.lessonCount
            })

            if (options.isFromShare) {
                wx.redirectTo({
                    url: '../lesson/lesson?class_id=' + this.data.class_id + '&class_group_id' + self.data.class_group_id + '&coursePrice=' + this.data.price + '&title=' + this.data.title + '&isFromShare=' + options.isFromShare
                })
            }else{
                //查询课程
                var param = {
                    class_id: this.data.class_id
                }
                util.fetchData(self.data.class_find_methodName, param, function (data) {
                    var content = data.class_content.split('&');
                    self.setData({
                        lesson: data,
                        content: content
                    })
                    var doc_param = {
                        doctor_id: data.doctor_id
                    }
                    //查询医生
                    util.fetchData(self.data.doctor_find_methodName, doc_param, function (data) {
                        self.setData({
                            doctor: data
                        })
                    })
                })
                //查询课件
                util.fetchData(self.data.class_courseware_query_methodName, param, function (data) {
                    var courseWares = [];
                    data.forEach(function (item, index, array) {
                        courseWares.push(item.resources_url);
                    })
                    self.setData({
                        courseWares: courseWares,
                        courseWaresCount: courseWares.length,
                        courseWaresWiperWidth: courseWares.length * 252,
                        canMoveCount: courseWares.length - 3
                    })
                })
            }
        },
        showBigImage: function (event) {
            console.log(event)
            this.setData({
                courseWareSrc: event.currentTarget.dataset.src
            })

        },
        closeBigCourseWare: function () {
            this.setData({
                courseWareSrc: ''
            })
        },
        tarchStart: function (event) {
            this.data.startX = event.touches[0].pageX;
        },
        tarchEnd: function (event) {
            if (this.data.canMoveCount > 0) {
                var self = this,
                    eachMoveX = 252,	    //每次移动距离	
                    moveX = 0,  		//移动距离
                    step = 63,	    //移动步长
                    during = 40,       //持续时间
                    eachMoveCounts = eachMoveX / step; //单次移动距离需要移动几小步
                this.data.endX = event.changedTouches[0].pageX;
                //左移
                if (this.data.endX < this.data.startX && Math.abs(this.data.movedCount) < this.data.canMoveCount) {
                    self.setData({
                        movedCount: self.data.movedCount - 1
                    })
                    var leftMovedSteps = 0;
                    var timer = setInterval(function () {
                        leftMovedSteps += 1;
                        console.log('moveL')
                        if (leftMovedSteps >= eachMoveCounts) {
                            clearInterval(timer);
                            self.setData({
                                moveLeft: self.data.moveLeft - step
                            })
                        } else {
                            self.setData({
                                moveLeft: self.data.moveLeft - step
                            })
                        }
                    }, during)
                    //右移
                } else if (this.data.endX > this.data.startX && this.data.movedCount < 0) {
                    var rightMovedSteps = 0;
                    self.setData({
                        movedCount: self.data.movedCount + 1
                    })
                    var rightTimer = setInterval(function () {
                        rightMovedSteps += 1;
                        if (rightMovedSteps >= eachMoveCounts) {
                            clearInterval(rightTimer);
                            self.setData({
                                moveLeft: self.data.moveLeft + step
                            })
                        } else {
                            self.setData({
                                moveLeft: self.data.moveLeft + step
                            })
                        }
                    }, during)
                }
            }
        },
        onShareAppMessage: function (ops) {
            var self = this;
            self.setData({
                isFromShare: true
            })
            return {
                title: '顾氏珺安健康课堂',
                path: 'pages/purlesson/purlesson?class_id=' + self.data.class_id + '&isFromShare=' + self.data.isFromShare + '&isPurchased=' + this.data.isPurchased + '&price=' + this.data.price + '&title=' + this.data.title
            }
        },
        toDoctors: function () {
            wx.navigateTo({
                url: '../doctors/doctors'
            })
        },
        navigateToDoctor: function (event) {
            var doctorid = event.currentTarget.dataset.doctorid;
            wx.navigateTo({
                url: '../doctor/doctor?doctorid=' + doctorid + '&class_group_id=' + this.data.class_group_id
            })
        },
    }
})
