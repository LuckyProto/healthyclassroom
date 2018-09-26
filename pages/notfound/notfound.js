// pages/notfound/notfound.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
      reRequest: function(){
          wx.login({
              success: res => {
                  if (res.code) {
                      var param = {
                          code: res.code
                      };
                      //发起网络请求
                      wx.request({
                          url: 'https://class-dev.gusmedsci.cn/hservice-wx/wechatLogin',
                          method: 'POST',
                          data: JSON.stringify(param),
                          success: function (res) {
                              if (res.data.code == 0) {
                                  wx.setStorageSync('sign', res.data.sign)
                              }
                          },
                          fail: function (err) {
                              console.log('login', err)
                              wx.navigateTo({
                                  url: '../notfound/notfound'
                              })
                          }
                      })
                  } else {
                      console.log('登录失败！' + res.errMsg)
                  }
              },
              fail: res => {
                  console.log('登录失败！' + res.errMsg)
              }
          })
      }
  }
})
