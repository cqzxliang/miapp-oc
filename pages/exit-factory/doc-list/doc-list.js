const auth = require('../../../core/auth');
const app = getApp();
const util = require('../../../utils/util');
const getEFDataListUrl = 'exfactory/EFDataList';
let all_list = [];
let new_list = [];
let wait_list = [];
let reject_list = [];
let approved_list = [];
let wait_retrun_list = [];
let void_list = [];
let page = 1;
const pageCount = 5;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_count: 0,
    wait_count: 0,
    reject_count: 0,
    approved_count: 0,
    wait_retrun_count: 0,
    void_count: 0,
    searchList: [],
    currentList: [],
    showList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let user = app.getUserInfo();
    const searchData = {
      created_by: user.ID
    }
    const res = await auth.request('GET', getEFDataListUrl, searchData);
    if (res && res.data && res.data.length > 0) {
      this.setData({
        searchList: res.data,
        currentList: res.data
      });
    }
    all_list = res.data;
    new_list = all_list.filter(e => e.STATUS === 'NEW' ||e.STATUS === 'CANCELED');
    wait_list = all_list.filter(e => e.STATUS === 'WAITING');
    reject_list = all_list.filter(e => e.STATUS === 'REJECTED');
    approved_list = all_list.filter(e => e.STATUS === 'APPROVED' && util.isNull(e.CHECK_EMPNO1));
    wait_retrun_list = all_list.filter(e => e.STATUS === 'APPROVED' && !util.isNull(e.CHECK_EMPNO1) && e.BACK_FLAG === "Y");
    void_list = all_list.filter(e => e.STATUS === 'VOID');
    const showList = this.data.currentList.slice(0,pageCount);
    this.setData({
      wait_count: wait_list.length,
      new_count: new_list.length,
      reject_count: reject_list.length,
      approved_count: approved_list.length,
      wait_retrun_count: wait_retrun_list.length,
      void_count: void_list.length,
      showList: showList
    })
    // wait_count = this.data.searchList.filter(e => e.STATUS==='WAITING').length;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeTabs(e) {
    if (e.detail.activeKey==='all'){
      this.setData({
        currentList: all_list
      });
    }else if(e.detail.activeKey==='new'){
      this.setData({
        currentList: new_list
      });
    }else if(e.detail.activeKey==='wait'){
      this.setData({
        currentList: wait_list
      });
    }else if(e.detail.activeKey==='reject'){
      this.setData({
        currentList: reject_list
      });
    }else if(e.detail.activeKey==='approved'){
      this.setData({
        currentList: approved_list
      });
    }else if(e.detail.activeKey==='wait_retrun'){
      this.setData({
        currentList: wait_retrun_list
      });
    }else if(e.detail.activeKey==='void'){
      this.setData({
        currentList: void_list
      });
    }
    const showList = this.data.currentList.slice(0,pageCount);
    page = 1;
    this.setData({
      showList: showList
    });
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
    if(page * pageCount < this.data.currentList.length){
      const addList = this.data.currentList.slice(page*pageCount,(page+1)*pageCount);
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