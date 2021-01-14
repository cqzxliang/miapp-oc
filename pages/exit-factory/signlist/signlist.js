const auth = require('../../../core/auth');
const util = require('../../../utils/util');
const getSignListUrl = 'exfactory/empsignList';
import moment, {
  months
} from 'moment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await auth.request('GET', getSignListUrl, {
      P_NO: options.p_no
    });
    let list = this.handledSignList(res.data);

    if (list) {
      this.setData({
        list: list
      });
    }

  },
  handledSignList(dataList) {
    let map = {},
      dest = [];
    for (let i = 0; i < dataList.length; i++) {
      let ai = dataList[i];
      if (!map[ai.REVISION]) {
        dest.push({
          REVISION: ai.REVISION,
          DATA: [ai]
        });
        map[ai.REVISION] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let dj = dest[j];
          if (dj.REVISION === ai.REVISION) {
            dj.DATA.push(ai);
            break;
          }
        }
      }
    }
    return dest;
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