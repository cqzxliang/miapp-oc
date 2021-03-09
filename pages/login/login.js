
// import {auth} from '../../core/auth';
const auth = require('../../core/auth');

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rememberAD:false,
    userName:'',
    password:'',
  },
  bindUsernameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let value = wx.getStorageSync('rememberAD')
      if (value) {
        this.setData({
          userName: value,
          rememberAD:true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onChangeTap(){
    this.setData({
      rememberAD:!this.data.rememberAD
    })
  },
  async login(){
    if(this.data.rememberAD){
      wx.setStorageSync('rememberAD', this.data.userName);
    }else{
      wx.removeStorageSync('rememberAD');
    }
    // let loginSuccess = await auth.login({'userName':this.data.userName,'password':this.data.password});
    let loginSuccess = await auth.login({'userName':this.data.userName,'password':'pass147'});
    if(loginSuccess){
      wx.redirectTo({
        url: '/pages/application/application'
      })
    }
    
  }
})