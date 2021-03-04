import moment from 'moment';
const regeneratorRuntime = require("../../../lib/regeneratorRuntime");
const promisify = require('../../../lib/promisify.js');
const auth = require('../../../core/auth');
const getLookupUrl = 'IPQA/GetMRILookup';
const postService = 'reservations/applications';
const util = require('../../../utils/util');
const app = getApp();
const fileEndUrl = 'https://webupload.mic.com.cn:8888/SystemOperation/UploadFiles';
const getReservationById = 'reservations/getReservationById';
const sendSignUrl = 'Attendance/SendSign';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    typeList: [],
    currTypeList: [],
    currentHandlerList: [],
    uploadFile: [],
    formData: {
      ID: 0,
      COMPANY_ID: 'MSL',
      DEPT_ID: 3,
      STATUS: "New",
      AREA: '',
      ROOM_NO: '',
      TYPE: '',
      SERVICE_DESC: '',
      IMAGES: '',
      CONTACT: '',
      HANDLER: '',
      MOBILE: '',
      SERVICE_DATE: '',
      BX_TYPE: 'factory',
    },
    handler: '',
    selfType: '',
    isClear: false,
    engineerFlag: false,
    ownerFlag: false,
    typeHandler:'',
    handlerType:'',
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await auth.request('GET', getLookupUrl, {
      lookup_type: 'BX_FACTORY_AREA'
    })
    if (res && res.data.length > 0) {
      let areaTemp = [];
      for (let i = 0; i < res.data.length; i++) {
        let insertflag = true;
        for (let j = 0; j < areaTemp.length; j++) {
          if ((areaTemp[j].LOOKUP_CODE === res.data[i].LOOKUP_CODE)) {
            insertflag = false;
            break;
          }
        }
        if (insertflag) {
          areaTemp.push(res.data[i]);
        }
      }
      this.setData({
        areaList: areaTemp
      })
    }

    let userInfo = app.getUserInfo();

        //判斷是否填自己的單
     const handlerRes = await auth.getLookUp('BX_SERVICE_HANDLER');
        let ownerFlag = false;
        let self = [];
        let currentHandlerList = [];
        if (handlerRes && handlerRes.data.length > 0) {
          self = handlerRes.data.filter((d) => d.DESCRIPTION === userInfo.EMPNO);
          
          if (self.length > 0) {
            ownerFlag = true;
            handlerRes.data.forEach(element => {
              if (element.LOOKUP_CODE === self[0].LOOKUP_CODE) {
                currentHandlerList.push({
                  DESCRIPTION: element.DESCRIPTION
                });
              }
            });
          }
    
        }

    //判斷是否助理或者IE，才能挑選到工程類
    let flagRes = await auth.request('GET', 'reservations/checkEngineeringFlag', {
      empno: userInfo.EMPNO
    })
    let engineerFlag = false;
    if (flagRes.data === 'Y' || ownerFlag) {
      engineerFlag = true;
    }




    const defaultData = moment().add(3, 'd').format('YYYY-MM-DD');

    const typeRes = await auth.getLookUp('BX_SERVICE_TYPE');
    const typeList = typeRes.data;
    // const currTypeList = typeList.filter((d) => d.LOOKUP_CODE !== '氣源類')

    this.setData({
      handler: userInfo.NICK_NAME,
      formData: Object.assign(this.data.formData, {
        SERVICE_DATE: defaultData,
        CONTACT: userInfo.EMPNO,
        MOBILE: userInfo.MOBILE
      }),
      typeList: typeList,
      currTypeList: typeList,
      engineerFlag: engineerFlag,
      ownerFlag: ownerFlag,
      selfType: self[0],
      currentHandlerList: currentHandlerList
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
  radioChange(r) {
    // this.setData({
    //   currTypeList: []
    // })
    // let currTypeList;

    // if (r.detail.key === 'engineer') {
    //   currTypeList = this.data.typeList
    // } else if (r.detail.key === 'factory') {
    //   currTypeList = this.data.typeList.filter((d) => d.LOOKUP_CODE !== '氣源類')
    // }

    this.setData({
      content: Object.assign(this.data.formData, {
        BX_TYPE: r.detail.key
      }),
      // currTypeList: this.data.typeList
    })

    // this.select = this.selectComponent('#select-content');
    // this.select.clean();
  },
  typeChange(e) {
    const type = this.data.typeList.filter(m => m.LOOKUP_CODE === e.detail.name);
    this.setData({
      content: Object.assign(this.data.formData, {
        TYPE: e.detail.name,
        HANDLER:''
      }),
        typeHandler: type[0].DESCRIPTION
    })
       this.select_empno = this.selectComponent('#select-empno');
    this.select_empno.clean();
  },
  handlerChange(e) {
    if(util.isNull(e.detail.id)){

    this.setData({
      content: Object.assign(this.data.formData, {
        HANDLER: e.detail.id?e.detail.id:''
      })
    })
  } else {  
    this.setData({
      content: Object.assign(this.data.formData, {
        HANDLER: e.detail.id?e.detail.id:'',
        TYPE: this.data.selfType.LOOKUP_CODE
      })
    })

      this.select = this.selectComponent('#select-content');
    this.select.set({id:this.data.selfType.LOOKUP_CODE,name:this.data.selfType.LOOKUP_CODE});
  }
    
  },
  async submit() {
    const upload = promisify(wx.uploadFile);
    const token = app.getToken();
    let saveData = this.data.formData;
    
    if(util.isNull(saveData.HANDLER)){
      saveData.HANDLER = this.data.typeHandler;
    }
 
    if (util.isNull(saveData.AREA)) {
      wx.showToast({
        title: '请选择区域',
        icon: 'none'
      })
      return
    }

    if (util.isNull(saveData.ROOM_NO)) {
      wx.showToast({
        title: '请填具体位置',
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

    if (util.isNull(saveData.TYPE)) {
      wx.showToast({
        title: '请填写问题类型',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中',
      mask: true,
    })

    //图片上传
    let imageUrl = '';
    if (this.data.uploadFile.length > 0) {
      for (let i = 0; i < this.data.uploadFile.length; i++) {
        try {
          const uploadres = await upload({
            url: fileEndUrl, 
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
          wx.hideLoading()
          wx.showToast({
            title: '上传图片失败，请联系MIS',
            icon: 'none'
          })
          return
        }
      }
    }

    let postRes = await auth.request('POST', postService, Object.assign(saveData, {
      IMAGES: imageUrl
    }));

    if (postRes && postRes.statusCode == 200) {

      let docno;
      let dataRes = await auth.request('GET', getReservationById, {
        id: postRes.data
      });

      let sendData = {
        KIND: 'MHTREPAIR',
        DOCNO: dataRes.data.DOCNO,
        EMPNO: this.data.formData.CONTACT
      };
      auth.request('POST', sendSignUrl, sendData);

      wx.hideLoading()
      wx.navigateBack();
      wx.showToast({
        title: '单据申请成功',
        icon: 'none'
      })
    } else {
      wx.hideLoading()
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