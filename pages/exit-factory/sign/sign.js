const auth = require('../../../core/auth');
const util = require('../../../utils/util');
const getBillDetailUrl = 'exfactory/signlist';
const getBossUrl = 'exfactory/getboss';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    applyEmpno: '',
    dataList: [],
    signList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  change(event) {
    Object.assign(this.data.signList[event.currentTarget.dataset.index], {
      EMPNO: event.detail.id,
      NAME: event.detail.name
    });
  },
  save() {
    if (this.data.status === 'WAITING' || this.data.status === 'APPROVED' ) {
      wx.showToast({
        title: '該单据狀態不能修改',
        icon: 'none'
      })
    } else {
      let error = false;
      this.data.signList.forEach(d => {
        if (util.isNull(d.EMPNO)) {
          error = true;
        }
      });
      if (error) {
        wx.showToast({
          title: '簽核名單不能為空',
          icon: 'none'
        })
      } else {
        wx.setStorageSync('signList', this.data.signList);
        wx.navigateBack();
      }
    }
  },
  onLoad: async function (options) {
    let status = options.status
    this.setData({
      status: status
    })
    let typeData = wx.getStorageSync('createType');
    let contentData = wx.getStorageSync('createContent');
    let signListData = wx.getStorageSync('signList');
    this.data.applyEmpno = contentData.APPLY_EMPNO;
    let res = await auth.request('GET', getBillDetailUrl, {
      id: typeData.typeId
    });
    let signTemp = res.data;
    signTemp = signTemp.filter(e => e.ID !== 4 && e.ID !== 8);
    let dataList = await this.handledSignList(signTemp);
    let signListTemp = [];
    if (dataList && dataList.length > 0 && signListData.length == 0) {
      dataList.forEach(d => {
        signListTemp.push({
          GROUP_ID: d.ID,
          EMPNO: d.DATA[0].EMPNO,
          NAME: d.DATA[0].NAME,
          SEQ: d.DATA[0].SEQ,
          SITE: 'MSL'
        });
      });
    } else {
      signListTemp = signListData;
    }

    this.setData({
      dataList: dataList,
      signList: signListTemp
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

  },
  async handledSignList(dataList) {
    let map = {},
      dest = [];
    for (let i = 0; i < dataList.length; i++) {
      let ai = dataList[i];
      if (ai.ID === 2) {
        const bossRes = await auth.request('GET', getBossUrl, {
          empno: this.data.applyEmpno,
          grade: 7
        });
        ai.EMPNO = bossRes.data[0].EMPNO;
        ai.NAME = bossRes.data[0].NICK_NAME;
      } else if (ai.ID === 23) {
        const bossRes = await auth.request('GET', getBossUrl, {
          empno: this.data.applyEmpno,
          grade: 5
        });
        ai.EMPNO = bossRes.data[0].EMPNO;
        ai.NAME = bossRes.data[0].NICK_NAME;
      } else if (ai.ID === 24) {
        const bossRes = await auth.request('GET', getBossUrl, {
          empno: this.data.applyEmpno,
          grade: 8
        });
        ai.EMPNO = bossRes.data[0].EMPNO;
        ai.NAME = bossRes.data[0].NICK_NAME;
      }
      let data = {
        ID: ai.ID,
        EMPNO: ai.EMPNO,
        NAME: ai.NAME,
        SEQ: ai.SEQ
      }
      if (!map[ai.ID]) {
        dest.push({
          ID: ai.ID,
          GROUP_NAME: ai.GROUP_NAME,
          DATA: [data]
        });
        map[ai.ID] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let dj = dest[j];
          if (dj.ID === ai.ID) {
            dj.DATA.push(data);
            break;
          }
        }
      }
    }
    return dest;
  }
})