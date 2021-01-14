const util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_no: '',
    list_no: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  search(){
    wx.navigateTo({
      url: `/pages/exit-factory/search-mo-list/search-mo-list?p_no=${this.data.p_no}&list_no=${this.data.list_no}`
    })
  },

  pNoKeyIn(event) {
    this.setData({
      p_no: event.detail.value
    })
  },
  listnoKeyIn(event) {
    this.setData({
      list_no: event.detail.value
    })
  },
  clearPNOInput() {
    this.setData({
      p_no: ''
    })
  },
  clearListNoInput() {
    this.setData({
      list_no: ''
    })
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

  }
})