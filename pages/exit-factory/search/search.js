import moment from 'moment';
const auth = require('../../../core/auth');
const app = getApp();
const util = require('../../../utils/util');
const getAllTypeUrl = 'exfactory/alltypes';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_no: '',
    typeid: '',
    list_no: '',
    part_no: '',
    s_out_date: '',
    e_out_date: '',
    s_back_date: '',
    e_back_date: '',
    allTypeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const res = await auth.request('GET', getAllTypeUrl, {});
    if(res&&res.data&&res.data.length>0){
      let data =  res.data;
      data = data.map(m => { return { 'id': m.ID, 'name': m.T_NAME } });
      
      this.setData({
        allTypeList: data
      })
    };

    const sMonth = moment(new Date().setDate(1)).format('YYYY-MM-DD');
    const eMonth = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('YYYY-MM-DD');
    this.setData({
      s_out_date: sMonth,
      e_out_date: eMonth
    })
  },
  reset(){
    const sMonth = moment(new Date().setDate(1)).format('YYYY-MM-DD');
    const eMonth = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('YYYY-MM-DD');
    this.setData({
      p_no: '',
      typeid: '',
      list_no: '',
      part_no: '',
      s_out_date: sMonth,
      e_out_date: eMonth,
      s_back_date: '',
      e_back_date: ''
    })
  },
  search(){
    wx.navigateTo({
      url: `/pages/exit-factory/searchlist/searchlist?p_no=${this.data.p_no}&typeid=${this.data.typeid}&list_no=${this.data.list_no}&part_no=${this.data.part_no}&s_out_date=${this.data.s_out_date}&e_out_date=${this.data.e_out_date}&s_back_date=${this.data.s_back_date}&e_back_date=${this.data.e_back_date}`
    })
  },
  pNoKeyIn(event) {
    this.setData({
      p_no: event.detail.value
    })
  },
  typeidKeyIn(event) {
    this.setData({
      typeid: event.detail.value
    })
  },
  listnoKeyIn(event) {
    this.setData({
      list_no: event.detail.value
    })
  },
  partnoKeyIn(event) {
    this.setData({
      part_no: event.detail.value
    })
  },
  sOutTimeChange(idate) {
    this.setData({
      s_out_date: idate.detail.value
    })
  },
  eOutTimeChange(idate) {
    this.setData({
      e_out_date: idate.detail.value
    })
  },
  sBackTimeChange(idate) {
    this.setData({
      s_back_date: idate.detail.value
    })
  },
  eBackTimeChange(idate) {
    this.setData({
      e_back_date: idate.detail.value
    })
  },
  typeChange(e){
    this.setData({
      typeid: e.detail.id
    })
  },
  clearPNOInput() {
    this.setData({
      p_no: ''
    })
  },
  clearTypeInput() {
    this.setData({
      typeid: ''
    })
  },
  clearListNoInput() {
    this.setData({
      list_no: ''
    })
  },
  clearPartNoInput() {
    this.setData({
      part_no: ''
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})