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
		courseid: undefined,
		doctors: []
  	},

  	/**
   	* 组件的方法列表
   	*/
  	methods: {
			onLoad: function (options) {
				var self = this;
				var courseid = options.courseid;
				this.data.courseid = courseid;
				wx.getStorage({
					key: 'doctors',
					success: function (res) {
						console.log(res)
						self.setData({
							doctors: res.data,
						})
						// res.data.forEach(function (value, index, array) {
						// 	if (value.courseId == courseid) {
						// 		console.log(value)
						// 		self.setData({
						// 			doctors: value.doctors,
						// 		})
						// 	}
						// })
					}
				})
			},
			navigateToDoctor: function (event) {
				var doctorid = event.currentTarget.dataset.doctorid;
				wx.navigateTo({
					url: '../doctor/doctor?doctorid=' + doctorid + '&courseid=' + this.data.courseid
				})
			},
  	}
})
