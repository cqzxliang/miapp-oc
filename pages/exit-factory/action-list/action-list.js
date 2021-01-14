const util = require('../../../utils/util');
const auth = require('../../../core/auth');
const postEFDataUrl = 'exfactory/EFData';
const getEFDataUrl = 'exfactory/EFDataList';
const sendApproveUrl = 'Attendance/SendSign';
const cancelApproveUrl = 'Attendance/CancelSign';
const kind = 'MHTEFACTORY';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodListCheck: false,
    contentCheck: false,
    signListCheck: false,
    p_no: '',
    status: '',
    typeDes:''
  },

  goToPage(page) {
    if (page.currentTarget.dataset.page === "doc") {
      wx.navigateTo({
        url: '/pages/exit-factory/docs/docs?status=' + this.data.status
      })
    } else if (page.currentTarget.dataset.page === "content") {
      if (this.data.goodListCheck) {
        wx.navigateTo({
          url: '/pages/exit-factory/content/content?status=' + this.data.status
        })
      } else {
        wx.showToast({
          title: '请先维护物品清单',
          icon: 'none',
          duration: 2000
        });
      }
    } else if (page.currentTarget.dataset.page === "sign") {
      let contentData = wx.getStorageSync('createContent');
      if (!util.isNull(contentData.APPLY_EMPNO)) {
        wx.navigateTo({
          url: '/pages/exit-factory/sign/sign?status=' + this.data.status
        })
      } else {
        wx.showToast({
          title: '请先维护单据内容信息',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },
  async save() {
    wx.showLoading({
      title: '提交中',
      mask:true,
    })
    let goodData = wx.getStorageSync('goodList');
    let contentData = wx.getStorageSync('createContent');
    let signListData = wx.getStorageSync('signList');

    let sendData = {
      mainData: contentData,
      billData: goodData,
      signData: signListData
    }
    const res = await auth.request('POST', postEFDataUrl, sendData).catch(err => {
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
      return
    });

    if (res.statusCode == 200 || res.statusCode == 201 ) {
      wx.setStorageSync('createContent', res.data);
      wx.setStorageSync('goodList', res.data.billData);
      wx.setStorageSync('signList', res.data.signData);
      this.setData({
        p_no: res.data.P_NO,
        status: res.data.STATUS
      })
    } else {
      wx.showToast({
        title: '提交失败:'+res.data,
        icon: 'none'
      })
      return
    };
    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
      },
    });
  },
  async saveData() {
    let goodData = wx.getStorageSync('goodList');
    let contentData = wx.getStorageSync('createContent');
    let signListData = wx.getStorageSync('signList');

    let sendData = {
      mainData: contentData,
      billData: goodData,
      signData: signListData
    }
    const res = await auth.request('POST', postEFDataUrl, sendData).catch(err => {
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
      return
    });

    if (res.statusCode == 200 || res.statusCode == 201 ) {
      wx.setStorageSync('createContent', res.data);
      wx.setStorageSync('goodList', res.data.billData);
      wx.setStorageSync('signList', res.data.signData);
      this.setData({
        p_no: res.data.P_NO,
        status: res.data.STATUS
      })
    } else {
      wx.showToast({
        title: '提交失败:'+res.data,
        icon: 'none'
      })
      return
    } ;
  },
  async sendApprove() {
    await this.saveData();
    wx.showLoading({
      title: '送签中',
      mask:true,
    })
    let contentData = wx.getStorageSync('createContent')
    let sendData = {
      KIND: kind,
      DOCNO: contentData.P_NO,
      EMPNO: contentData.APPLY_EMPNO
    };
    const res = await auth.request('POST', sendApproveUrl, sendData).catch(err => {
      wx.showToast({
        title: '送签失败',
        icon: 'none'
      })
      return
    });
    this.setData({
      status: 'WAITING'
    });
    contentData.STATUS = 'WAITING';
    contentData.PROCESS_FLAG = '1';
    wx.setStorageSync('createContent', contentData);
    wx.hideLoading({
      success: (res) => {
        wx.showToast({
          title: '送签成功',
          icon: 'none'
        })
      },
    });
  },
  async cancelApprove() {
    let contentData = wx.getStorageSync('createContent')
    if(contentData.PROCESS_FLAG&& contentData.PROCESS_FLAG==='1'){
      wx.showToast({
        title: '单据正在送签中，不能取消送签！',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '取消送签中',
      mask:true,
    })
    let sendData = {
      KIND: kind,
      DOCNO: this.data.p_no
    };

    try {
      const res = await auth.request('POST', cancelApproveUrl, sendData);
      this.setData({
        status: 'CANCELED'
      });
      contentData.STATUS = 'CANCELED';
      wx.setStorageSync('createContent', contentData);

      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '取消送签成功',
            icon: 'none',
            duration: 3000
          })
        },
      });
    } catch (e) {
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '取消送签失败',
            icon: 'none',
            duration: 3000
          })
        },
      });
    }
  },
  signlist(){
    wx.navigateTo({
      url: '/pages/exit-factory/signlist/signlist?p_no=' + this.data.p_no
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let typeData = wx.getStorageSync('createType');
    this.setData({
      typeDes: typeData.typeName
    });
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
    let goodData = wx.getStorageSync('goodList');
    if (goodData && goodData.length > 0) {
      this.setData({
        goodListCheck: true
      })
    } else {
      this.setData({
        goodListCheck: false
      })
    }
    let contentData = wx.getStorageSync('createContent');
    if (!util.isNull(contentData.APPLY_EMPNO)) {
      this.setData({
        contentCheck: true
      })
    } else {
      this.setData({
        contentCheck: false
      })
    }

    let signListData = wx.getStorageSync('signList');

    if (signListData && signListData.length > 0) {
      this.setData({
        signListCheck: true
      })
    } else {
      this.setData({
        signListCheck: false
      })
    }

    if (contentData.P_NO) {
      const res = await auth.request('GET', getEFDataUrl, {
        p_no: contentData.P_NO
      });
      if (res) {
        wx.setStorageSync('createContent', res.data[0]);
        wx.setStorageSync('goodList', res.data[0].billData);
        wx.setStorageSync('signList', res.data[0].signData);
        this.setData({
          p_no: res.data[0].P_NO,
          status: res.data[0].STATUS
        })
      }
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

  }
})