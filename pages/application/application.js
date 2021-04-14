const auth = require('../../core/auth');
const app = getApp();
// pages/application/application.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrevention:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isPrevention=  auth.hasPrivilege('Prevention_Confirm','preventionConfirm');
    this.setData({
      isPrevention
    })
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

  goToPage(page) {

    if (page.currentTarget.id === '1') {
      wx.navigateTo({
        url: '/pages/exit-factory/exit-factory'
      })
    }

    if (page.currentTarget.id === '2') {
      wx.navigateTo({
        url: '/pages/repair/repair'
      })
    }

    if (page.currentTarget.id === '3') {
      wx.navigateTo({
        url: '/pages/score/score'
      })
    }

    if (page.currentTarget.id === '4') {
      wx.navigateTo({
        url: '/pages/prevention/prevention'
      })
    }
    if (page.currentTarget.id === '5') {
      wx.navigateTo({
        url: '/pages/prevention/comfirm-list/comfirm-list'
      })
    }
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

  }
})