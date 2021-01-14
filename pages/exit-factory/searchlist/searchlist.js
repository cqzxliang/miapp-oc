import moment from 'moment';
const auth = require('../../../core/auth');
const app = getApp();
const util = require('../../../utils/util');
const getEFDataListUrl = 'exfactory/EFDataList';
let page = 1;
const pageCount = 5;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    showList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    let user = app.getUserInfo();
    const searchData = {
      created_by: user.ID,
      p_no: options.p_no,
      part_no: options.part_no,
      typeid: options.typeid,
      list_no: options.list_no,
      s_out_date: options.s_out_date,
      e_out_date: options.e_out_date,
      s_back_date: options.s_back_date,
      e_back_date: options.e_back_date,
    }
    const res = await auth.request('GET', getEFDataListUrl, searchData);
    if (res && res.data && res.data.length > 0) {
      page = 1;
      const showList = res.data.slice(0,pageCount);
      this.setData({
        searchList: res.data,
        showList:showList
      });
    } else {
      wx.showToast({
        title: '没有对应的查询记录',
        icon: 'none'
      })
    }

  },
  goToDetail(e) {
    const data = e.currentTarget.dataset.item;
    wx.setStorageSync('createType', {
      typeId: data.T_ID,
      typeName:data.CNTYPE
    });
    wx.setStorageSync('createContent', data);
    wx.setStorageSync('goodList', data.billData);
    wx.setStorageSync('signList', data.signData);


    wx.navigateTo({
      url: `/pages/exit-factory/action-list/action-list`
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
    
    if(page * pageCount < this.data.searchList.length){
      const addList = this.data.searchList.slice(page*pageCount,(page+1)*pageCount);
      this.setData({
        showList: this.data.showList.concat(addList)
      });
      page=page+1;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})