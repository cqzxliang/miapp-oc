const app = getApp();
const auth = require('../../../core/auth');
const getBillDetailUrl = 'exfactory/billdetail2';
// pages/docs/docs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    goodList: []
  },
  goToDetail(item) {
    if (this.data.status === 'WAITING') {
      wx.showToast({
        title: '签核中单据不能修改',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: `/pages/exit-factory/docs-edit/docs-edit?index=${item.currentTarget.dataset.index}&newFlag=2`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let status = options.status
    this.setData({
      status: status
    })
    let data = wx.getStorageSync('goodList');
    if (data && data.length > 0) {

    } else {
      let list = wx.getStorageSync('attachmentList');
      //  ['GG021901000001','GG021901000002','GG022001000001'];
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      if (list.length > 0) {
        const res = await auth.request('GET', getBillDetailUrl, {
          reqno: list.join(',')
        });
        if (res) {
          let data = res.data;
          if (data.length > 0) {
            data = data.filter(e => e.NOT_USE > 0);
            data.map((d => {
              return Object.assign(d, {
                QTY_USE: d.NOT_USE
              });
            }))
            this.setData({
              goodList: data
            });
            wx.setStorageSync('goodList', data)
          }
        }
        wx.hideLoading({
          success: (res) => {},
        });
      }else {
        wx.hideLoading({
          success: (res) => {},
        });
      }
    }
  },
  addOne() {
    if (this.data.status === 'WAITING') {
      wx.showToast({
        title: '签核中单据不能修改',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: `/pages/exit-factory/docs-edit/docs-edit?index=&newFlag=1`,
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
    let data = wx.getStorageSync('goodList');
    this.setData({
      goodList: data
    });
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