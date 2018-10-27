//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // check session
    wx.checkSession({
      success: function(){
        self.loginStatus.logined = true;
        self.getSession();
      },
      fail: function(){
        self.login();
      }
    })

    // 登录
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  login: function(){
    wx.login({
      success: function(loginRes){
        if (loginRes.code){
          wx.request({
            url: 'https://localhost:3000/login',
            data: {
              code: loginRes.code
            },
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.statusCode == 200) {
                // do something
                wx.setStorageSync('session_id', res.data);
                this.loginStatus.session_id = res.data;
                this.loginStatus.logined = true;
              }
              else {
                this.loginStatus.logined = false;
              }
            },
            fail: function(res){
              this.loginStatus.logined = false;
            }
          })
        } else{
          this.loginStatus.logined = false;
        }
      },
      fail: function(err){
        this.loginStatus.logined = false;
      }
    })
  },
  loginStatus: {
    logined: false,
    session_id: null
  },
  getSession: function () {
    this.loginStatus.session_id = wx.getStorageSync('session_id');
  },
  globalData: {
    userInfo: null
  }
})