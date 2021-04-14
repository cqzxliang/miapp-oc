const dateTimePicker = require('../../../utils/dateTimePicker');
const util = require("../../../utils/util");
const getUserUrl = 'Guid/GetUserLikeNoSite';
const auth = require('../../../core/auth');
const getLookupUrl = 'IPQA/GetMRILookup';
const postService = 'reservations/applications';


// pages/repair/distribute-content/distribute-content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    content: {

    },
    isSubmitValidate: true,
    imageList: [],
    typeList: [],
    handlerList: [],
    currentHandlerList: [],
    contact: '',
    handler: '',
    date: '2021-01-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2021,
    endYear: 2050,
    requiredRules: {
      required: true,
    },
    actQTYRules: [{
        validator(rule, value, callback, source) {
          const {
            HANDLE_TIME
          } = source;
          if (HANDLE_TIME > 0) {} else {
            callback(false);
          }
          callback()
        },
        message: '处理耗时要大于0',
        trigger: 'change'
      },
      {
        type: 'number',
        required: true
      },
    ],
    handleTimeError: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let data = JSON.parse(options.data);
    let type = options.type;
    if (type === 'done') {
      wx.setNavigationBarTitle({
        title: "单据完成"
      })
    }

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      content: data,
      type: type,
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    })
    let imageList;
    if (!util.isNull(data.IMAGES)) {
      imageList = data.IMAGES.split(",").map((str) => str.indexOf('http') > -1 ? str : 'https://miwebapi.mic.com.cn/' + str);
    }
    let contactRes = await auth.request('GET', getUserUrl, {
      emp_name: data.CONTACT
    })

    const typeRes = await auth.getLookUp('BX_SERVICE_TYPE');
    const typeList = typeRes.data;
    const handlerRes = await auth.getLookUp('BX_SERVICE_HANDLER');
    const handlerList = handlerRes.data;

    let currentHandlerList;
    if (!util.isNull(data.TYPE)) {
      currentHandlerList = handlerList.filter(d => d.LOOKUP_CODE === this.data.content.TYPE);
    }

    this.setData({
      imageList: imageList,
      typeList: typeList,
      handlerList: handlerList,
      currentHandlerList: currentHandlerList,
      contact: contactRes.data[0].NICK_NAME + ' ' + contactRes.data[0].TELEPHONE + '/' + contactRes.data[0].MOBILE
    })

    wx.lin.initValidateForm(this)
  },
  preview: function (e) {
    // e.currentTarget.dataset.url能拿到当前点击的图片的url，前提是在wxml里配合使用data-url
    // urls(this.data.imageList)是从后台拿到图片的合集
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },
  typeChange(e) {
    if (e.detail.name !== this.data.content.TYPE) {
      const currentHandlerList = this.data.handlerList.filter(d => d.LOOKUP_CODE === e.detail.name);
      this.setData({
        currentHandlerList: []
      })
      this.setData({
        content: Object.assign(this.data.content, {
          TYPE: e.detail.name,
          HANDLER: '',
        }),
        currentHandlerList: currentHandlerList
      })

      this.selectEmpno = this.selectComponent('#select-empno');
      this.selectEmpno.clean();
    }
  },
  handlerChange(e) {

    this.setData({
      content: Object.assign(this.data.content, {
        HANDLER: e.detail.id
      })
    })
  },
  async submit() {
    let saveData = this.data.content;

    if (util.isNull(saveData.HANDLER)) {
      wx.showToast({
        title: '請填寫處理人',
        icon: 'none'
      })
      return
    }

    let postRes = await auth.request('POST', postService, {
      ID: saveData.ID,
      DEPT_ID: saveData.DEPT_ID,
      DOCNO: saveData.DOCNO,
      STATUS: 'Processing',
      TYPE: saveData.TYPE,
      HANDLER: saveData.HANDLER,
      SERVICE_DATE: saveData.SERVICE_DATE,
      CONTACT: saveData.CONTACT,
      AREA: saveData.AREA,
      ROOM_NO: saveData.ROOM_NO,
      SERVICE_DESC: saveData.SERVICE_DESC
    });

    if (postRes && postRes.statusCode == 200) {
      wx.navigateBack();
      wx.showToast({
        title: '单据分配成功',
        icon: 'none'
      })
    } else {
      wx.navigateBack();
      wx.showToast({
        title: '单据分配失败，请联系MIS',
        icon: 'none'
      })
    }
  },
  async submit2() {
    let saveData = this.data.content;

    if (util.isNull(saveData.HANDLER)) {
      wx.showToast({
        title: '請填寫處理人',
        icon: 'none'
      })
      return
    }

    if (util.isNull(saveData.HANDLE_TIME) || this.data.handleTimeError) {
      wx.showToast({
        title: '請檢查处理耗时內容是否填寫正確',
        icon: 'none'
      })
      return
    }

    let processTime = this.data.dateTimeArray1[0][this.data.dateTime1[0]] + '-' +
      this.data.dateTimeArray1[1][this.data.dateTime1[1]] + '-' + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + ' ' +
      this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ':' + this.data.dateTimeArray1[4][this.data.dateTime1[4]];

    let postRes = await auth.request('POST', postService, {
      ID: saveData.ID,
      DEPT_ID: saveData.DEPT_ID,
      DOCNO: saveData.DOCNO,
      STATUS: 'Scoring',
      TYPE: saveData.TYPE,
      HANDLER: saveData.HANDLER,
      SERVICE_DATE: saveData.SERVICE_DATE,
      CONTACT: saveData.CONTACT,
      AREA: saveData.AREA,
      ROOM_NO: saveData.ROOM_NO,
      SERVICE_DESC: saveData.SERVICE_DESC,
      PROCESS_TIME: processTime,
      HANDLE_TIME: saveData.HANDLE_TIME,
      REMARK: saveData.REMARK,
    });

    if (postRes && postRes.statusCode == 200) {
      wx.navigateBack();
      wx.showToast({
        title: '单据處理完成',
        icon: 'none'
      })
    } else {
      wx.navigateBack();
      wx.showToast({
        title: '单据處理失敗，请联系MIS',
        icon: 'none'
      })
    }
  },
  handleTimeCheck(re) {
    this.setData({
      handleTimeError: re.detail.isError
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  remarkKeyIn(event) {
    this.setData({
      content: Object.assign(this.data.content, {
        REMARK: event.detail.value
      })
    })
  },
  handleTimeKeyIn(event) {
    this.setData({
      content: Object.assign(this.data.content, {
        HANDLE_TIME: event.detail.value
      })
    })
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }
})