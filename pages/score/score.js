const auth = require('../../core/auth');
const app = getApp();
const util = require('../../utils/util');
const getServeListUrl = 'Service/GetServices';

// pages/score/score.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreList:[]
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
  onShow:async function () {
    let user = app.getUserInfo();
  
    const res = await auth.request('GET', getServeListUrl, {
      contact: user.EMPNO,
      // contact: '25917',
      docno:'',
      status:'',handler:'',type:'',company_id:'',date_fm:'',date_to:'',dept_id:'',
    });
    if(res && res.data&&res.data.length>0){
      let scoreList =  res.data.filter(e => e.STATUS === 'Scoring' );
      this.setData({
        scoreList:scoreList
      })
      wx.setStorageSync('scoreList', scoreList)
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

  },
})