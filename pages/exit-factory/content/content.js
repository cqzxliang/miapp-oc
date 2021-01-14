import * as Rx from '../../../lib/rxjs.umd.min';
const app = getApp();
const util = require('../../../utils/util');
const {
  catchError,
  switchMap,
  map,
  distinctUntilChanged,
  debounceTime
} = Rx.operators;
const searchEmp = new Rx.Subject();
let mySub;

const auth = require('../../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
// pages/content/content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    searchNum: 1,
    colleague1: [],
    colleague2: [],
    colleague3: [],
    iscompany: false,
    isSubmitValidate: false,
    isContainer: false, //是否貨櫃類
    formData: {
      ID: 0,
      KEYPERSON_NAME: '',
      KEYPERSON_TEL: '',
      KEYPERSON_DEPT: '',
      APPLY_EMPNO: '',
      OUT_TIME: '',
      BACK_FLAG: '',
      BACK_TIME: '',
      BACK_EMPNO: '',
      BACK_PERSON: '',
      GET_SITE: '',
      OUT_SITE: '',
      OUT_PERSON: '',
      OUT_MOBILE: '',
      OUT_COMPANY: '',
      CAR_NO: '',
      DRIVER: '',
      KEY_NUMBER: '',
      EXPRESS_REMARK: '',
      REMARK: '',
      STATUS: 'NEW',
      PRINT_FLAG: 0,
      SITE: 'MSL'
    },
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let status = options.status
    this.setData({
      status: status
    })
    mySub = new Rx.Subscription();
    mySub = searchEmp.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim().length > 2) {
          const empname = term.trim().toUpperCase().replace(/^\"/g, '').replace(/\"$/g, '');
          return auth.request('GET', getUserUrl, {
            emp_name: empname
          })
        } else {
          this.colleague1 = [];
          this.colleague2 = [];
          this.colleague3 = [];
          return Rx.of([]);
        }
        return Rx.of([]);
      }),
    ).subscribe(
      (res) => {
        if (this.data.searchNum === 1) {
          // this.colleague1 = rea.data;
          this.setData({
            colleague1: res.data
          })
        } else if (this.data.searchNum === 2) {
          this.setData({
            colleague2: res.data
          })
        } else if (this.data.searchNum === 3) {
          this.setData({
            colleague3: res.data
          })
        }
      },
      err => {
        console.log(err);
      },
    );
    let contentData = wx.getStorageSync('createContent');
    let typeData = wx.getStorageSync('createType');
    if (typeData && typeData.typeId) {
      if (typeData.typeId == 22 || typeData.typeId == 20) {
        this.setData({
          formData: Object.assign(this.data.formData, {
            BACK_FLAG: 'Y'
          })
        })
      } else {
        this.setData({
          formData: Object.assign(this.data.formData, {
            BACK_FLAG: 'N'
          })
        })
      }

      if (typeData.typeId == 0 || typeData.typeId == 1 || typeData.typeId == 143) {
        this.setData({
          isContainer: true
        })
      }
    }

    if (contentData && !util.isNull(contentData.APPLY_EMPNO)) {
      const res = await auth.request('GET', getUserUrl, {
        emp_name: contentData.APPLY_EMPNO
      })
      if (res.data && res.data.length > 0) {
        contentData.KEYPERSON_NAME = res.data[0].NICK_NAME;
        contentData.KEYPERSON_TEL = res.data[0].TELEPHONE;
        contentData.KEYPERSON_DEPT = res.data[0].DEPT_NAME;
      }
      this.setData({
        formData: Object.assign(this.data.formData, contentData)
      })
    } else {
      let userInfo = app.getUserInfo();
      const applyDate = {
        KEYPERSON_NAME: userInfo.NICK_NAME,
        KEYPERSON_TEL: userInfo.TELEPHONE,
        KEYPERSON_DEPT: userInfo.DEPT_NAME,
        APPLY_EMPNO: userInfo.EMPNO
      }
      this.setData({
        formData: Object.assign(this.data.formData, applyDate)
      })
    }

    wx.lin.initValidateForm(this)
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

  applyKeyIn(item) {
    this.setData({
      searchNum: 1
    })
    if (item.detail.value.length < 3) {
      this.setData({
        colleague1: []
      })
    } else {
      searchEmp.next(item.detail.value);
    }
  },
  outpersonKeyIn(item) {
    this.setData({
      searchNum: 2
    })
    if (item.detail.value.length < 3) {
      this.setData({
        colleague2: []
      })
    } else {
      searchEmp.next(item.detail.value);
    }
  },
  backEmpnoKeyIn(item) {
    this.setData({
      searchNum: 3
    })
    if (item.detail.value.length < 3) {
      this.setData({
        colleague3: []
      })
    } else {

      searchEmp.next(item.detail.value);
    }
  },
  submit(event) {
    // wx.lin.initValidateForm(this)
    if (this.data.status === 'WAITING') {
      wx.showToast({
        title: '签核中单据不能修改',
        icon: 'none'
      })
    } else {
      let typeData = wx.getStorageSync('createType');
      let saveData = this.data.formData;
      saveData = Object.assign(saveData, {
        T_ID: typeData.typeId
      });
      if (util.isNull(saveData.APPLY_EMPNO)) {
        wx.showToast({
          title: '请填写正确的申请人',
          icon: 'none'
        })
        return
      }
      if (util.isNull(saveData.OUT_TIME)) {
        wx.showToast({
          title: '预计出厂时间不能为空',
          icon: 'none'
        })
        return
      }
      if (util.isNull(saveData.GET_SITE)) {
        wx.showToast({
          title: '領料地點不能為空',
          icon: 'none'
        })
        return
      }
      if (util.isNull(saveData.OUT_SITE)) {
        wx.showToast({
          title: '前往地點不能为空',
          icon: 'none'
        })
        return
      }
      if ((util.isNull(saveData.OUT_PERSON) || util.isNull(saveData.OUT_MOBILE) || util.isNull(saveData.OUT_COMPANY)) && !this.data.isContainer) {
        wx.showToast({
          title: '出厂信息没有填写完整',
          icon: 'none'
        })
        return
      }
      if ((saveData.T_ID == 22 || saveData.T_ID == 20) && (util.isNull(saveData.BACK_TIME) || util.isNull(saveData.BACK_EMPNO))) {
        wx.showToast({
          title: '回厂信息没有填写完整',
          icon: 'none'
        })
        return
      }
      wx.setStorageSync('createContent', saveData);
      wx.navigateBack();
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

  },
  chooseKeyPerson(e) {
    const target = e.currentTarget.dataset.item;
    const applyDate = {
      KEYPERSON_NAME: target.NICK_NAME,
      KEYPERSON_TEL: target.TELEPHONE,
      KEYPERSON_DEPT: target.DEPT_NAME,
      APPLY_EMPNO: target.EMPNO
    }
    this.setData({
      formData: Object.assign(this.data.formData, applyDate)
    })
    this.setData({
      colleague1: []
    });
  },
  clearKeyPersonInput() {
    this.setData({
      colleague1: []
    })
  },
  outTimeChange(idate) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        OUT_TIME: idate.detail.value
      })
    })
  },
  backTimeChange(idate) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        BACK_TIME: idate.detail.value
      })
    })
  },
  getSiteKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        GET_SITE: event.detail.value
      })
    })
  },
  outSiteKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        OUT_SITE: event.detail.value
      })
    })
  },
  outPersonKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        OUT_PERSON: event.detail.value
      })
    })
  },
  outMobileKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        OUT_MOBILE: event.detail.value
      })
    })
  },
  outCompanyKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        OUT_COMPANY: event.detail.value
      })
    })
  },
  carNoKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        CAR_NO: event.detail.value
      })
    })
  },
  driverKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        DRIVER: event.detail.value
      })
    })
  },
  keyNumberKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        KEY_NUMBER: event.detail.value
      })
    })
  },
  expressRemarkKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        EXPRESS_REMARK: event.detail.value
      })
    })
  },
  remarkKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        REMARK: event.detail.value
      })
    })
  },
  switch1Change(e) {
    this.setData({
      iscompany: e.detail.value
    })
  },
  chooseOutPerson(e) {
    const target = e.currentTarget.dataset.item;
    const applyDate = {
      OUT_PERSON: target.NICK_NAME,
      OUT_MOBILE: target.MOBILE,
      OUT_COMPANY: '顺达电脑厂有限公司'
    }
    this.setData({
      formData: Object.assign(this.data.formData, applyDate)
    })
    this.setData({
      colleague2: []
    });
  },
  chooseBackEmpno(e) {
    const target = e.currentTarget.dataset.item;
    const Data = {
      BACK_EMPNO: target.EMPNO,
      BACK_PERSON: target.NICK_NAME
    }
    this.setData({
      formData: Object.assign(this.data.formData, Data)
    })
    this.setData({
      colleague3: []
    });
  },
  clearOutPersonInput() {
    this.setData({
      colleague2: []
    })
  },
  clearBackEmpnoInput() {
    this.setData({
      formData: Object.assign(this.data.formData, {
        BACK_PERSON: '',
        BACK_EMPNO: ''
      }),
      colleague3: []
    })
  },
  getSiteCheck(e) {
    // console.log(e);
  }
})