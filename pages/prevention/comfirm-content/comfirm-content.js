import moment from 'moment';
const fileEndUrl = 'https://webupload.mic.com.cn:8888/SystemOperation/UploadFiles';
const promisify = require('../../../lib/promisify.js');
const util = require('../../../utils/util');
const auth = require('../../../core/auth');
const app = getApp();
const postData = 'prevention/ApplyData';
// pages/prevention/comfirm-content/comfirm-content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    yuekangUrls: [],
    tripUrls: [],
    nucleic1Urls: [],
    nucleic2Urls: [],
    nucleic3Urls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.data);

    let data = JSON.parse(options.data);
    this.setData({
      formData: data,
      yuekangUrls: data.YUE_KANG_CODE ? data.YUE_KANG_CODE.split(",") : [],
      tripUrls: data.TRIP_CODE ? data.TRIP_CODE.split(",") : [],
      nucleic1Urls: data.NUCLEIC_ACID_TEST1 ? data.NUCLEIC_ACID_TEST1.split(",") : [],
      nucleic2Urls: data.NUCLEIC_ACID_TEST2 ? data.NUCLEIC_ACID_TEST2.split(",") : [],
      nucleic3Urls: data.NUCLEIC_ACID_TEST3 ? data.NUCLEIC_ACID_TEST3.split(",") : [],
    })
  },
  async submit() {
    let sendConfirm = true;
    const showModal = promisify(wx.showModal);

    await showModal({
      title: '信息提醒',
      content: '是否確認OK',
    }).then(res => {
      console.log(res);
      if (res.confirm) {
        sendConfirm = true;
      }
      if (res.cancel) {
        sendConfirm = false;
      }
    })

    if (sendConfirm) {
      wx.showLoading({
        title: '提交中',
        mask: true,
      })
      let userInfo = app.getUserInfo();
      const defaultData = moment().add(0, 'd').format('YYYY-MM-DD');

      let postRes = await auth.request('POST', postData, {
        ID: this.data.formData.ID,
        OK_FLAG: 'Y',
        APPROVED_EMPNO: userInfo.EMPNO,
        APPROVED_DATE: defaultData
      });

      if (postRes && postRes.statusCode == 200) {
        wx.hideLoading()
        wx.navigateBack();
        wx.showToast({
          title: '审核成功',
          icon: 'none'
        })
      } else {
        wx.hideLoading()
        // wx.navigateBack();
        wx.showToast({
          title: '审核失败，请联系MIS',
          icon: 'none'
        })
      }
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

  }
})