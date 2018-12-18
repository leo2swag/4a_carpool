//index.js
//获取应用实例
const app = getApp()
var t_loc_name = ""
var t_loc_add = ""

var iFunctions = {
  _getCityName: function (latitude, longitude, that) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=ZN5BZ-XIUK4-V3RU6-XL3QJ-ZL723-D5FBO',
      data: {},
      success: function (res) {
        console.log("逆地址解析", res);
        console.log("逆地址解析", res.data.result.address_component.city);
        that.setData({
          dep_city: res.data.result.address_component.city
        });
      },
      fail: function (res) {

      }
    })
  }
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    date: '2018-10-01',
    user_number: 4168308548,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: '12:01',
    array: ["10 CAD", "15 CAD", "20 CAD", "25 CAD", "30 CAD", "35 CAD", "40 CAD", "面谈"],
    index: 2,
    time_sec: "",
    dep_loc_greeting: "地图上显示",
    arr_loc_greeting: "地图上显示",
    dep_loc_name: "",
    dep_lati: "",
    dep_longti: "",
    dep_city: "test",
    arr_loc_name: "",
    arr_lati: "",
    arr_longti: "",
    tempic: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindchooselocTapdep: function () {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          dep_loc_name: res.name,
          dep_lati: res.latitude,
          dep_longti: res.longitude,
          dep_loc_greeting: ""
        })
        iFunctions._getCityName(res.latitude, res.longitude, that);
       
      }
    })
  },
  bindchooselocTaparr: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          arr_loc_name: res.name,
          arr_lati: res.latitude,
          arr_longti: res.longitude,
          arr_loc_greeting: ""
        })
      }
    })
  },
  bindchoosepicselect: function () {
    wx.chooseImage({
      count: 1, // Default 9
      sizeType: ['original', 'compressed'], // Can specify whether it is the original or compressed image, both have defaults
      sourceType: ['album', 'camera'], // Can specify whether the source is an album or camera, both have defaults
      success: function (res) {
        // Returns the local file path list for the selected photo, tempFilePath can be used as the img tag's src attribute to display the image
        //var tempFilePaths: res.tempFilePaths
        that.setData({
          tmpic: res.tempFiles
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    var sec
    console.log('time发送选择改变，携带值为', e.detail.value)
    if (e.detail.value < '11:00') {
      sec = '[上午]'
    } else if (e.detail.value < '13:00') {
      sec = '[中午]'
    } else if (e.detail.value < '19:00') {
      sec = '[下午]'
    } else {
      sec = '[晚上]'
    }
    this.setData({
      time_sec: sec,
      time: e.detail.value
    })
  },
  bindPriceChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
})


