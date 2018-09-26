// pages/lessons/lessons.js
const app  = getApp()
const md5  = require('../../utils/md5.js')
const util = require('../../utils/util.js')
Page({
/**
* 组件的初始数据
*/
data: {
    isLogin                             : false,
    //请求方法
    order_query_methodName              : 'sp_hc_credential_order_group_query', //购买列表
    collect_query_methodName            : 'sp_hc_class_group_collect_query',
    collect_save_methodName             : 'sp_hc_class_group_collect_save',
    collect_del_methodName              : 'sp_hc_class_group_collect_del',
    class_group_find_methodName         : 'sp_hc_class_group_app_find',
    class_courseware_query_methodName   : 'sp_hc_class_courseware_query',
    class_find_methodName               : 'sp_hc_class_find',
    doctor_find_methodName              : 'sp_hc_doctor_find',
    order_no_methodName                 : 'hc_order_no',        //订单号
    order_save_methodName               : 'sp_hc_order_save',   //保存订单

    hidden                              : false,     //加载样式
    class_group_id                      : undefined,
    class_id                            : undefined,
    lesson                              : null,
    idx                                 : undefined,   //课程序号
    lessonCount                         : undefined,    //套课内课程数量
    title                               : undefined,
    coursePrice                         : 0,
    isBuy                               : 0,
    isCollect                           : 0,

    //医生
    doctor                              : null,
    //课件
    courseWares             : null,
    courseWaresCount        : 0,
    courseWaresWiperWidth   : 0,  
    //移动
    startX                              :0,     //移动初始位置
    endX                                :0,     //移动结束位置
    moveLeft                            :0,     //移动到的位置
    canMoveCount                        :0,     //可以移动的次数
    movedCount                          :0,     //已经移动的次数

    //课件src
    courseWareSrc                       : undefined,

    //支付id
    openid                              : undefined,
    //分享
    isFromShare                         : false
},

/**
* 组件的方法列表
*/
// methods: {
    /**
    * 生命周期获取初始数据
    */
    onLoad: function (options){
        var self = this;
        //是否处于登录状态
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true
            })
        } else {
            util.login(app);
        }

        //设置初始数据
        var price = options.price ? Number(options.price) : Number(options.coursePrice);
        if (options.isFromShare){
            this.setData({
                isFromShare: options.isFromShare,
                coursePrice: options.coursePrice
            })
        }
        this.setData({
            // isLogin         : options.isLogin == 'true' ? true : false,
            class_group_id  : Number(options.class_group_id),
            class_id        : Number(options.class_id),
            title           : options.title,
            // isBuy           : Number(options.isBuy),
            // isCollect       : Number(options.isCollect),
            idx             : Number(options.idx),
            lessonCount     : Number(options.lessonCount),
            // openid          : app.globalData.openid,
            coursePrice     : price
        })
        //查询课程
        var param = {
            class_id    : self.data.class_id
        }
        util.fetchData(self.data.class_find_methodName, param, function (data) {
            var content = data.class_content.split('&');
            self.setData({
                lesson: data,
                content: content
            })

            //查询医生
            var doc_param = {
                doctor_id : data.doctor_id
            }
            util.fetchData(self.data.doctor_find_methodName, doc_param, function (data) {
                self.setData({
                    doctor: data
                })
            })
        })

        //查询课件
        util.fetchData(self.data.class_courseware_query_methodName, param, function (data) {
            var courseWares = [];
            if(data){
                data.forEach(function (item, index, array) {
                    courseWares.push(item.resources_url);
                })
            }
            self.setData({
                hidden: true
            });
            self.setData({
                courseWares             : courseWares,
                courseWaresCount        : courseWares.length,
                courseWaresWiperWidth   : courseWares.length * 252,
                canMoveCount            : courseWares.length - 3
            })
        })
    },
    onShow: function(){
        var self = this;
        //获取购买套课的ID
        var _param = {
            methodName: "sp_hc_credential_order_group_query"
        },
            sign = wx.getStorageSync('sign');
        util.fetchData(self.data.order_query_methodName, _param, function (data) {
            if (data) {
                data.forEach(function (item, index, array) {
                    if (item.class_group_id == self.data.class_group_id) {
                        self.setData({
                            isBuy: 1
                        })
                    }
                })
            }
            self.setData({
                hidden: true
            });
        })
        //获取收藏的套课ID
        var collect_ids_param = {
            "methodName": "sp_hc_class_group_collect_query"
        }
        util.fetchData(self.data.collect_query_methodName, collect_ids_param, function (data) {
            if (data) {
                data.forEach(function (item, index, array) {
                    if (item.class_group_id == self.data.class_group_id) {
                        self.setData({
                            isCollect: 1
                        })
                    }
                })
            }
        })
    },
    toDoctors: function(){
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
    onShareAppMessage: function (ops) {
        var self = this;
        if (ops.from === 'button') {
            // 来自页面内转发按钮
        }
        self.setData({
            isFromShare: true
        })
        return {
            title: '悦讲健康',
            path: 'pages/lesson/lesson?class_id=' + self.data.class_id + '&class_group_id=' + self.data.class_group_id + '&coursePrice=' + self.data.coursePrice + '&title=' + self.data.title + '&isFromShare' + self.data.isFromShare + '&idx=' + self.data.idx + '&lessonCount=' + self.data.lessonCount,
            success: function (res) {
                //转发成功
                self.setData({
                    isFromShare: false
                })
            },
            fail: function (res) {
                //转发失败
            }
        }
    },
    //改变登录状态
    onChangeLoginState: function(e){
        this.setData({
            isLogin: e.detail.isLogin
        })
    }
// }
})
