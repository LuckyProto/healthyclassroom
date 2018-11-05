//app.js
const util = require('./utils/util.js')
App({
  	onLaunch: function () {
        //登录
        util.login(this);
  	},
    onHide: function () {
        // wx.removeStorageSync('purchasedList');
        // wx.removeStorageSync('userInfo');
        // wx.removeStorageSync('sign');
    },
  	globalData: {
        isiOS   : false,
        openid  : undefined, 
		sign    : undefined,
    	userInfo: null
        //lesson  : null
  	}
})