// pages/doctor/doctor.js
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
        class_group_app_query_methodName: 'sp_hc_class_group_app_query',

    	doctor: undefined,
    	videoList: null
    },

    /**
     * 组件的方法列表
     */
  	methods: {
	  	onLoad: function(options){
			var self = this;
			var doctorid = options.doctorid,
				courseid = options.courseid;
			this.data.doctorid = doctorid;
			wx.getStorage({
				key: 'doctors',
				success: function (res) {
					res.data.forEach(function (value, index, array) {
						if (value.doctor_id == doctorid) {
							self.setData({
								doctor: value
							})
						}
					})
				}
			})
			var docLessonsParam = {
					page_num: 1,
					page_size: 10,
					doctor_id: doctorid
				};
            util.fetchData(self.data.class_group_app_query_methodName, docLessonsParam, function (data) {
                self.setData({
                    videoList: data.rows
                })
            })
		},
		navigateToLessons: function (event) {
            let class_group_id = event.currentTarget.dataset.class_group_id;
            let doctor_num = event.currentTarget.dataset.doctor_num;
            wx.navigateTo({
                url: '../lessons/lessons?class_group_id=' + class_group_id + '&doctor_num=' + doctor_num
            })
        },
  	}
})
