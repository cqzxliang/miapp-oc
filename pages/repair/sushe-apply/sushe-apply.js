import moment from 'moment';
const regeneratorRuntime = require("../../../lib/regeneratorRuntime");
const promisify = require('../../../lib/promisify.js');
const auth = require('../../../core/auth');
const getLookupUrl = 'IPQA/GetMRILookup';
const postService = 'reservations/applications';
const util = require('../../../utils/util');
const app = getApp();
const fileEndUrl = 'https://webupload.mic.com.cn:8888/SystemOperation/UploadFiles';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    uploadFile: [],
    formData: {
      ID: 0,
      COMPANY_ID: 'MSL',
      DEPT_ID: 3,
      STATUS: "New",
      AREA: '',
      ROOM_NO: '',
      SERVICE_DESC: '',
      IMAGES: '',
      CONTACT: '',
      MOBILE: '',
      SERVICE_DATE: '',
      BX_TYPE : 'dorm',
    },
    handler: '',
    isClear: false,
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await auth.request('GET', getLookupUrl, {
      lookup_type: 'BX_SERVICE_AREA'
    })
    if (res && res.data.length > 0) {
      let areaTemp = [];
      for (let i = 0; i < res.data.length; i++) {
        let insertflag = true;
        for (let j = 0; j < areaTemp.length; j++) {
           if ((areaTemp[j].LOOKUP_CODE === res.data[i].LOOKUP_CODE)){
            insertflag = false;
            break;
           }
        }
        if(insertflag){
          areaTemp.push(res.data[i]);
        }
      }
      this.setData({
        areaList: areaTemp
      })
    }

    let userInfo = app.getUserInfo();
    const defaultData = moment().add(3, 'd').format('YYYY-MM-DD');

    this.setData({
      handler: userInfo.NICK_NAME,
      formData: Object.assign(this.data.formData, {
        SERVICE_DATE: defaultData,
        CONTACT: userInfo.EMPNO,
        MOBILE: userInfo.MOBILE
      })
    })

    wx.lin.initValidateForm(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  areaChange(e) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        AREA: e.detail.name
      })
    })
  },
  roomNoKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        ROOM_NO: event.detail.value
      })
    })
  },
  serviceDescKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        SERVICE_DESC: event.detail.value
      })
    })
  },
  addImage(e) {
    this.setData({
      uploadFile: e.detail.all
    })
  },
  timeChange(idate) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        SERVICE_DATE: idate.detail.value
      })
    })
  },
  async submit() {
    const upload = promisify(wx.uploadFile);
    const token = app.getToken();
    const saveData= this.data.formData;

    if (util.isNull(saveData.AREA)) {
      wx.showToast({
        title: '请选择区域',
        icon: 'none'
      })
      return
    }

    if (util.isNull(saveData.ROOM_NO)) {
      wx.showToast({
        title: '请填写宿舍号',
        icon: 'none'
      })
      return
    }

    if (util.isNull(saveData.SERVICE_DESC)) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      })
      return
    }

    //图片上传
    let imageUrl = '';
    if (this.data.uploadFile.length > 0) {
      for (let i = 0; i < this.data.uploadFile.length; i++) {
        try {
          const uploadres = await upload({
            url: fileEndUrl, //仅为示例，非真实的接口地址
            filePath: this.data.uploadFile[i].url,
            name: 'file',
            header: {
              'systemName': 'SERVICE',
              access_token: token
            }
          });
          if (uploadres && uploadres.data) {
            let data = JSON.parse(uploadres.data);
            const url = data[0].FilePath;
            if (util.isNull(imageUrl)) {
              imageUrl = url;
            } else {
              imageUrl = imageUrl + ',' + url;
            }
          }
        } catch (error) {         
          wx.showToast({
            title: '上传图片失败，请联系MIS',
            icon: 'none'
          })
          return
        }
      }
    }

    let postRes = await auth.request('POST', postService,  Object.assign(saveData, {
      IMAGES: imageUrl
    }));

    if(postRes&&postRes.statusCode==200){
      wx.navigateBack();
      wx.showToast({
        title: '单据申请成功',
        icon: 'none'
      })
    }else{
      wx.navigateBack();
      wx.showToast({
        title: '单据申请失败，请联系MIS',
        icon: 'none'
      })
    }
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