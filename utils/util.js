const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function login(context){
    wx.login({
        success: res => {
            if (res.code) {
                var param = {
                    code: res.code
                };
                //发起网络请求
                wx.request({
                    // url: 'https://class-dev.gusmedsci.cn/hservice-wx/wechatLogin',
                    url: 'https://health.gusmedsci.cn/hservice-wx/wechatLogin',    
                    method: 'POST',
                    data: JSON.stringify(param),
                    success: function (res) {
                        if (res.data.code == 0) {
                            wx.setStorageSync('sign', res.data.sign)
                            try{
                                context.globalData.openid = res.data.data.openid
                            }catch(err){
                                context.globalData.openid = res.data.data.openid
                            }
                        }
                    },
                    fail: function (err) {
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
//获取小程序数据
function fetchData(methodName, param, callback){
    var sign = wx.getStorageSync('sign');
    wx.request({
        // url: 'https://class-dev.gusmedsci.cn/hservice-wx/comm',
        url: 'https://health.gusmedsci.cn/hservice-wx/comm',
        
        method: 'POST',
        header: {
            //设置参数内容类型为x-www-form-urlencoded
            'Accept': 'application/json',
            'sign': sign
        },
        data: {
            methodName  : methodName,
            param       : JSON.stringify(param)
        },    
        //参数为键值对字符串
        success: function (res) {
            if (res.data.code == 0){
                wx.setStorageSync('sign', res.data.sign)
                callback(res.data.data)
            }else{
                wx.showModal({
                    title: '网络错误',
                    content: '请退出后重新登录',
                    showCancel: false,
                    confirmColor: '#FFA334',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        },
        fail: function(err){
            console.log('err', err)
            // wx.navigateTo({
            //     url: '../notfound/notfound'
            // })
            wx.showModal({
                title: '签名错误',
                content: '请退出后重新登录',
                showCancel: false,
                confirmColor: '#FFA334',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    })
}
//获取后台数据
function fetchBackData(methodName, param, callback) {
    var sign = wx.getStorageSync('sign');
    wx.request({
        // url: 'https://class-dev.gusmedsci.cn/hservice/comm',
        url: 'https://health.gusmedsci.cn/hservice-wx/comm',
        
        method: 'POST',
        header: {
            //设置参数内容类型为x-www-form-urlencoded
            'Accept': 'application/json',
            'sign': sign
        },
        data: {
            methodName: methodName,
            param: JSON.stringify(param)
        },
        //参数为键值对字符串
        success: function (res) {
            if (res.data.code == 0) {
                wx.setStorageSync('sign', res.data.sign)
                callback(res.data.data)
            } else {
                wx.showModal({
                    title: '网络错误',
                    content: '请退出后重新登录',
                    showCancel: false,
                    confirmColor: '#FFA334',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        },
        fail: function (err) {
            console.log('err', err)
            // wx.navigateTo({
            //     url: '../notfound/notfound'
            // })
            wx.showModal({
                title: '签名错误',
                content: '请退出后重新登录',
                showCancel: false,
                confirmColor: '#FFA334',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    })
}
function wxPay(param, callback) {
    var sign = wx.getStorageSync('sign');
    wx.request({
        // url: 'https://class-dev.gusmedsci.cn/hservice-wx/appletOrder',
        url: 'https://health.gusmedsci.cn/hservice-wx/appletOrder',
        
        method: 'POST',
        header: {
            //设置参数内容类型为x-www-form-urlencoded
            'Accept': 'application/json',
            'sign': sign
        },
        data: JSON.stringify(param),
        //参数为键值对字符串
        success: function (res) {
            if (res.data.code == 0) {
                wx.setStorageSync('sign', res.data.sign)
                callback(JSON.parse(res.data.data))
            } else {
                wx.showModal({
                    title: '网络错误',
                    content: '请退出后重新登录',
                    showCancel: false,
                    confirmColor: '#FFA334',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        },
        fail: function (err) {
            console.log('err', err)
            // wx.navigateTo({
            //     url: '../notfound/notfound'
            // })
            wx.showModal({
                title: '签名错误',
                content: '请退出后重新登录',
                showCancel: false,
                confirmColor: '#FFA334',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    })
}
function requestPayment(param){
    wx.requestPayment({
        'timeStamp': param.timeStamp,
        'nonceStr': param.nonceStr,
        'package': param.package,
        'signType': 'MD5',
        'paySign': param.paySign,
        'success': function (res) {
            console.log('succ', res)
            wx.showModal({
                title: '',
                content: '购买成功',
                showCancel: false,
                confirmColor: '#FFA334'
            })
        },
        'fail': function (res) {
            console.log('fail', res)
        }
    })
}

//显示模态框
function showModal(param, callback){
    wx.showModal({
        title   : param.title,
        content : param.content,
        confirmColor: '#FFA334',
        success : function (res) {
            if (res.confirm) {
                callback()
            } else if (res.cancel) {
            }
        }
    })
}
module.exports = {
    formatTime      : formatTime,
    fetchData       : fetchData,
    fetchBackData   : fetchBackData,
    wxPay           : wxPay,
    requestPayment  : requestPayment,
    showModal       : showModal,
    login           : login
}
