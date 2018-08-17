// pages/lessons/lessons.js
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
	  	class_id: undefined,
	  	lesson: null,
        price : 0,
		isPurchased: undefined
  	},

  /**
   * 组件的方法列表
   */
  	methods: {
		onLoad: function (options){
			console.log(options)
			var self = this;
			var class_id = options.class_id;
			var isPurchased = options.isPurchased;
            var price = options.price;
			var classList = wx.getStorageSync('classList');
			classList.forEach(function(item, index, value){
				if(item.class_id == class_id){
					self.setData({
						class_id: class_id,
						lesson: item,
                        price : price,
						isPurchased: isPurchased
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
    }
})
