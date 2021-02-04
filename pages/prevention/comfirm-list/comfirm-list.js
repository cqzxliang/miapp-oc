const auth = require('../../../core/auth');
const app = getApp();
const getList = 'prevention/waitConfirm';
let page = 1;
const pageCount = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
     comfirmList:[],
     showList:[]
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
    let userInfo = app.getUserInfo();

    //宿舍报修
    let res = await auth.request('GET', getList, {
      empno:'',
      deptno:''
    })
    if (res && res.data.length > 0) {
      page = 1;
      const showList = res.data.slice(0,pageCount);
      this.setData({
        comfirmList: res.data,
        showList:showList
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
    if(page * pageCount < this.data.comfirmList.length){
      const addList = this.data.comfirmList.slice(page*pageCount,(page+1)*pageCount);
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