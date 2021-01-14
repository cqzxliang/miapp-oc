// pages/exit-factory/exit-factory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  goToPage(page) {

    if (page.currentTarget.id === '1') {
      wx.navigateTo({
        url: '/pages/exit-factory/create/create'
      })
    }
    else if(page.currentTarget.id === '2') {
      wx.navigateTo({
        url: '/pages/exit-factory/search/search'
      })
    }
    else if(page.currentTarget.id === '3') {
      wx.navigateTo({
        url: '/pages/exit-factory/doc-list/doc-list'
      })
    }
    else if(page.currentTarget.id === '4') {
      
      wx.navigateTo({
        url: '/pages/exit-factory/search-mo/search-mo'
      })
    }
  }
})