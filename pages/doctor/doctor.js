// pages/doctor/doctor.js
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
	  doctor: undefined,
	  videoList: null
	//   videoList: [
	// 	  {
	// 		  courseImgUrl: '../../images/index/u4.png',
	// 		  courseName: '甲状腺疾病',
	// 		  doctor: [
	// 			  {
	// 				  doctorName: '张玲',
	// 				  doctorHospital: '北京协和医院',
	// 				  jobTitle: '内分泌科甲状腺颈部外科,内分泌科甲状腺颈部外科'
	// 			  }
	// 		  ],
	// 		  courseNumber: '3节课',
	// 		  coursePrice: '2000',
	// 		  courseTip: '3000人已经购买'
	// 	  },
	// 	  {
	// 		  courseImgUrl: '../../images/index/u4.png',
	// 		  courseName: '预防内分泌疾病需要做的几点注意事项',
	// 		  doctor: [
	// 			  {
	// 				  doctorName: '刘晓莉',
	// 				  doctorHospital: '首都医科大学附属院北京妇产',
	// 				  jobTitle: '内分泌科 主任医师'
	// 			  }
	// 		  ],
	// 		  courseNumber: '3节课',
	// 		  coursePrice: '8900',
	// 		  courseTip: '366700人已经购买'
	// 	  },
	// 	  {
	// 		  courseImgUrl: '../../images/index/u4.png',
	// 		  courseName: '引起头痛的五大疾病',
	// 		  doctor: [
	// 			  {
	// 				  doctorName: '王雪',
	// 				  doctorHospital: '北京协和医院',
	// 				  jobTitle: '神经内科 副主任医师等3人'
	// 			  }
	// 		  ],
	// 		  courseNumber: '3节课',
	// 		  coursePrice: '500',
	// 		  courseTip: '34500人已经购买'
	// 	  }
	//   ]
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
							console.log(self.doctor)
						}
					})
				}
			})
			var _sign = wx.getStorageSync('sign'),
				doc_lesson_param = {
					page_num: 1,
					page_size: 10,
					doctor_id: doctorid
				};
			wx.request({
				url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
				method: 'POST',
				header: {
					sign: _sign
				},
				data: {
					methodName: 'sp_hc_class_group_app_query',
					param: JSON.stringify(doc_lesson_param)
				},
				success: function (res) {
					wx.setStorageSync('sign', res.data.sign);
					self.setData({
						videoList: res.data.data.rows
					})
					console.log(res.data.data.rows)
				}
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
