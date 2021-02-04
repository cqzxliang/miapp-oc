const auth = require('../../../core/auth');
const app = getApp();
const getLookupUrl = 'IPQA/GetMRILookup';
const getServiceUrl = 'Service/GetServices';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    typeList: [],
    susheList: [],
    serviceList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let userInfo = app.getUserInfo();

    //宿舍报修
    let res = await auth.request('GET', getLookupUrl, {
      lookup_type: 'BX_SERVICE_AREA'
    })
    if (res && res.data.length > 0) {
      this.setData({
        areaList: res.data
      })
    }
    const area = this.data.areaList.filter(d => d.DESCRIPTION === userInfo.EMPNO);
    if (area.length > 0) {
      let serviceRes = await auth.request('GET', getServiceUrl, {
        docno: '',
        status: 'New',
        contact: '',
        handler: '',
        type: '',
        company_id: 'MSL',
        date_fm: '',
        date_to: '',
        dept_id: '3'
      });

      if (serviceRes && serviceRes.data.length > 0) {
        let listTemp = [];
        for (let i = 0; i < serviceRes.data.length; i++) {
          let insertflag = false;
          for (let j = 0; j < area.length; j++) {
            if ((area[j].LOOKUP_CODE === serviceRes.data[i].AREA)) {
              insertflag = true;
              break;
            }
          }
          if (insertflag) {
            listTemp.push(serviceRes.data[i]);
          }
        }
        this.setData({
          susheList: listTemp
        })

      }
    }

    //厂区报修
    let res2 = await auth.request('GET', getLookupUrl, {
      lookup_type: 'BX_SERVICE_TYPE'
    })
    if (res2 && res2.data.length > 0) {
      this.setData({
        typeList: res2.data
      })
    }
    const type = this.data.typeList.filter(d => d.DESCRIPTION === userInfo.EMPNO);
    if (type.length > 0) {
      let serviceRes2 = await auth.request('GET', getServiceUrl, {
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

      if (serviceRes2 && serviceRes2.data.length > 0) {
        const data = serviceRes2.data.filter((d)=>d.BX_TYPE==='factory');
        this.setData({
          susheList: this.data.susheList.concat(data)
        })
      }



      // if (serviceRes && serviceRes.data.length > 0) {
      //   let listTemp = [];
      //   for (let i = 0; i < serviceRes.data.length; i++) {
      //     let insertflag = false;
      //     for (let j = 0; j < area.length; j++) {
      //       if ((area[j].LOOKUP_CODE === serviceRes.data[i].AREA)) {
      //         insertflag = true;
      //         break;
      //       }
      //     }
      //     if (insertflag) {
      //       listTemp.push(serviceRes.data[i]);
      //     }
      //   }
      //   this.setData({
      //     susheList: listTemp
      //   })

      // }
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