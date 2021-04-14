
const auth = require('../../../core/auth');
const { async } = require('../../../lib/regeneratorRuntime');
const app = getApp();
const getLookupUrl = 'IPQA/GetMRILookup';
const getServiceUrl = 'Service/GetServices';
const util = require('../../../utils/util');
let page = 1;
const pageCount = 7;
// pages/repair/done/done.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    showList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
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
    let userInfo = app.getUserInfo();
    let serviceRes = await auth.request('GET', getServiceUrl, {
      docno: '',
      status: 'Processing',
      contact: '',
      handler: userInfo.EMPNO,
      type: '',
      company_id: 'MSL',
      date_fm: '',
      date_to: '',
      dept_id: '3'
    });
    
    if(serviceRes&&serviceRes.data.length>0){
      let dataRes = serviceRes.data.filter((d)=> d.STATUS!=='Canceled' && d.STATUS!=='CX');
     let data = dataRes.sort((a, b) => util.sortUtils.byDate(a.SERVICE_DATE, b.SERVICE_DATE, false));
     const showList = data.slice(0,pageCount);
     this.setData({
      dataList:data,
      showList:showList
     })
    }else{
      this.setData({
        dataList:[],
        showList:[]
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
  onPullDownRefresh:async function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(page * pageCount < this.data.dataList.length){
      const addList = this.data.dataList.slice(page*pageCount,(page+1)*pageCount);
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