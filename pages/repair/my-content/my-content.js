const util = require("../../../utils/util");
const getUserUrl = 'Guid/GetUserLikeNoSite';
const auth = require('../../../core/auth');
const getLookupUrl = 'IPQA/GetMRILookup';
const postService = 'reservations/applications';


// pages/repair/distribute-content/distribute-content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {

    },
    imageList: [],
    typeList: [],
    handlerList: [],
    currentHandlerList: [],
    contact: '',
    handler: '',
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let data = JSON.parse(options.data);
    this.setData({
      content: data
    })
    let imageList;
    if (!util.isNull(data.IMAGES)) {
      imageList = data.IMAGES.split(",").map((str) => str.indexOf('http') > -1 ? str : 'https://miwebapi.mic.com.cn/' + str);
      this.setData({
        imageList: imageList
      })
    }

    if (!util.isNull(data.HANDLER)) {
      let handlerRes = await auth.request('GET', getUserUrl, {
        emp_name: data.HANDLER
      })

      this.setData({
        handler: handlerRes.data[0].NICK_NAME + ' ' + handlerRes.data[0].TELEPHONE + '/' + handlerRes.data[0].MOBILE
      })
    }

    wx.lin.initValidateForm(this)
  },
  preview: function (e) {
    // e.currentTarget.dataset.url能拿到当前点击的图片的url，前提是在wxml里配合使用data-url
    // urls(this.data.imageList)是从后台拿到图片的合集
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },
  typeChange(e) {
    if (e.detail.name !== this.data.content.TYPE) {
      const currentHandlerList = this.data.handlerList.filter(d => d.LOOKUP_CODE === e.detail.name);
      this.setData({
        currentHandlerList: []
      })
      this.setData({
        content: Object.assign(this.data.content, {
          TYPE: e.detail.name,
          HANDLER: '',
        }),
        currentHandlerList: currentHandlerList
      })

      this.selectEmpno = this.selectComponent('#select-empno');
      this.selectEmpno.clean();
    }
  },
  handlerChange(e) {

    this.setData({
      content: Object.assign(this.data.content, {
        HANDLER: e.detail.id
      })
    })
  },
  async submit() {
    let saveData = this.data.content;

    if (util.isNull(saveData.HANDLER)) {
      wx.showToast({
        title: '請填寫處理人',
        icon: 'none'
      })
      return
    }

    let postRes = await auth.request('POST', postService, {
      ID: saveData.ID,
      DEPT_ID: saveData.DEPT_ID,
      DOCNO: saveData.DOCNO,
      STATUS: 'Processing',
      TYPE: saveData.TYPE,
      HANDLER: saveData.HANDLER,
      SERVICE_DATE: saveData.SERVICE_DATE,
      CONTACT: saveData.CONTACT,
      AREA: saveData.AREA,
      ROOM_NO: saveData.ROOM_NO,
      SERVICE_DESC: saveData.SERVICE_DESC
    });

    if (postRes && postRes.statusCode == 200) {
      wx.navigateBack();
      wx.showToast({
        title: '单据分配成功',
        icon: 'none'
      })
    } else {
      wx.navigateBack();
      wx.showToast({
        title: '单据分配失败，请联系MIS',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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