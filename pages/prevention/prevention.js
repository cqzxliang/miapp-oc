import moment from 'moment';
const fileEndUrl = 'https://webupload.mic.com.cn:8888/SystemOperation/UploadFiles';
const promisify = require('../../lib/promisify.js');
const util = require('../../utils/util');
const auth = require('../../core/auth');
const app = getApp();
const postData = 'prevention/ApplyData';
const getData = 'prevention/line';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sending: false,
    contact: '',
    formData: {
      ID: 0,
      TYPE: '未出行佛山市外',
      TIMES: 'first',
      APPLY_EMPNO: '',
      IDATE: '',
      COLD_FLAG: 'N',
      REMARK: '',
      YUE_KANG_CODE: '',
      TRIP_CODE: '',
      NUCLEIC_ACID_TEST1: '',
      NUCLEIC_ACID_TEST2: '',
      NUCLEIC_ACID_TEST3: '',
      OK_FLAG: 'N',
    },
    yuekangUploadFile: [],
    tripUploadFile: [],
    nucleic1UploadFile: [],
    nucleic2UploadFile: [],
    nucleic3UploadFile: [],
    yuekangUrls: [],
    tripUrls: [],
    nucleic1Urls: [],
    nucleic2Urls: [],
    nucleic3Urls: [],
    historyData: [],
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = app.getUserInfo();
    const defaultData = moment().add(0, 'd').format('YYYY-MM-DD');

    let dataRes = await auth.request('GET', getData, {
      empno: userInfo.EMPNO
    });
    if (dataRes && dataRes.data.length > 0) {
      //存放已提交过记录
      const historyData = dataRes.data;
      this.setData({
        contact: userInfo.NICK_NAME,
        formData: Object.assign(this.data.formData, dataRes.data[0]),
        yuekangUrls: dataRes.data[0].YUE_KANG_CODE ? dataRes.data[0].YUE_KANG_CODE.split(",") : [],
        tripUrls: dataRes.data[0].TRIP_CODE ? dataRes.data[0].TRIP_CODE.split(",") : [],
        nucleic1Urls: dataRes.data[0].NUCLEIC_ACID_TEST1 ? dataRes.data[0].NUCLEIC_ACID_TEST1.split(",") : [],
        nucleic2Urls: dataRes.data[0].NUCLEIC_ACID_TEST2 ? dataRes.data[0].NUCLEIC_ACID_TEST2.split(",") : [],
        nucleic3Urls: dataRes.data[0].NUCLEIC_ACID_TEST3 ? dataRes.data[0].NUCLEIC_ACID_TEST3.split(",") : [],
        historyData: historyData
      })
    } else {
      this.setData({
        contact: userInfo.NICK_NAME,
        formData: Object.assign(this.data.formData, {
          APPLY_EMPNO: userInfo.EMPNO,
          IDATE: defaultData
        })
      })
    }

    wx.lin.initValidateForm(this)
  },
  //类别切换
  radioChange(r) {
    const data = this.data.historyData.filter((d) => d.TYPE === r.detail.key && d.TIMES === 'first');
    if (data.length > 0) {
      this.setData({
        formData: data[0],
        yuekangUrls: data[0].YUE_KANG_CODE ? data[0].YUE_KANG_CODE.split(",") : [],
        tripUrls: data[0].TRIP_CODE ? data[0].TRIP_CODE.split(",") : [],
        nucleic1Urls: data[0].NUCLEIC_ACID_TEST1 ? data[0].NUCLEIC_ACID_TEST1.split(",") : [],
        nucleic2Urls: data[0].NUCLEIC_ACID_TEST2 ? data[0].NUCLEIC_ACID_TEST2.split(",") : [],
        nucleic3Urls: data[0].NUCLEIC_ACID_TEST3 ? data[0].NUCLEIC_ACID_TEST3.split(",") : [],
      })
    } else {
      let userInfo = app.getUserInfo();
      const defaultData = moment().add(0, 'd').format('YYYY-MM-DD');
      this.setData({
        formData: {
          ID: 0,
          TYPE: r.detail.key,
          TIMES: 'first',
          APPLY_EMPNO: userInfo.EMPNO,
          IDATE: defaultData,
          COLD_FLAG: 'N',
          REMARK: '',
          YUE_KANG_CODE: '',
          TRIP_CODE: '',
          NUCLEIC_ACID_TEST1: '',
          NUCLEIC_ACID_TEST2: '',
          NUCLEIC_ACID_TEST3: '',
          OK_FLAG: 'N',
        },
        yuekangUrls: [],
        tripUrls: [],
        nucleic1Urls: [],
        nucleic2Urls: [],
        nucleic3Urls: [],
      })
    }
  },
  //有无感冒症状切换
  coldChange(r) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        COLD_FLAG: r.detail.key,
      })
    })
  },
  //次数切换
  timesChange(r) {
    const data = this.data.historyData.filter((d) => d.TYPE === '出行廣東省外' && d.TIMES === r.detail.key);
    if (data.length > 0) {
      this.setData({
        formData: data[0],
        yuekangUrls: data[0].YUE_KANG_CODE ? data[0].YUE_KANG_CODE.split(",") : [],
        tripUrls: data[0].TRIP_CODE ? data[0].TRIP_CODE.split(",") : [],
        nucleic1Urls: data[0].NUCLEIC_ACID_TEST1 ? data[0].NUCLEIC_ACID_TEST1.split(",") : [],
        nucleic2Urls: data[0].NUCLEIC_ACID_TEST2 ? data[0].NUCLEIC_ACID_TEST2.split(",") : [],
        nucleic3Urls: data[0].NUCLEIC_ACID_TEST3 ? data[0].NUCLEIC_ACID_TEST3.split(",") : [],
      })
    } else {
      let userInfo = app.getUserInfo();
      const defaultData = moment().add(0, 'd').format('YYYY-MM-DD');
      this.setData({
        formData: {
          ID: 0,
          TYPE: '出行廣東省外',
          TIMES: r.detail.key,
          APPLY_EMPNO: userInfo.EMPNO,
          IDATE: r.detail.key === 'first' ? defaultData : '',
          COLD_FLAG: 'N',
          REMARK: '',
          YUE_KANG_CODE: '',
          TRIP_CODE: '',
          NUCLEIC_ACID_TEST1: '',
          NUCLEIC_ACID_TEST2: '',
          NUCLEIC_ACID_TEST3: '',
          OK_FLAG: 'N',
        },
        yuekangUrls: [],
        tripUrls: [],
        nucleic1Urls: [],
        nucleic2Urls: [],
        nucleic3Urls: [],
      })
    }
  },
  //返岗时间变更
  timeChange(idate) {
    const diff3 = moment(idate.detail.value).diff(moment(moment().format('YYYY-MM-DD')), 'days')
    if (diff3 < 0) {
      wx.showToast({
        title: '不能填过去日期',
        icon: 'none'
      })
      return
    }
    if (diff3 > 3) {
      wx.showToast({
        title: '只能填三天之内日期',
        icon: 'none'
      })
      return
    }
    this.setData({
      formData: Object.assign(this.data.formData, {
        IDATE: idate.detail.value
      })
    })
  },
  //感冒症状填写
  remarkKeyIn(event) {
    this.setData({
      formData: Object.assign(this.data.formData, {
        REMARK: event.detail.value
      })
    })
  },
  //点击添加图片
  addImage(e) {
    if (e.currentTarget.dataset.type === 'yuekang') {
      this.setData({
        yuekangUploadFile: e.detail.all
      })
    }
    if (e.currentTarget.dataset.type === 'trip') {
      this.setData({
        tripUploadFile: e.detail.all
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic1') {
      this.setData({
        nucleic1UploadFile: e.detail.all
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic2') {
      this.setData({
        nucleic2UploadFile: e.detail.all
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic3') {
      this.setData({
        nucleic3UploadFile: e.detail.all
      })
    }
  },
  //点击删除图片
  removeImage(e) {
    if (e.currentTarget.dataset.type === 'yuekang') {
      this.setData({
        yuekangUploadFile: [],
        formData: Object.assign(this.data.formData, {
          YUE_KANG_CODE: ''
        })
      })
    }
    if (e.currentTarget.dataset.type === 'trip') {
      this.setData({
        tripUploadFile: [],
        formData: Object.assign(this.data.formData, {
          TRIP_CODE: ''
        })
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic1') {
      this.setData({
        nucleic1UploadFile: [],
        formData: Object.assign(this.data.formData, {
          NUCLEIC_ACID_TEST1: ''
        })
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic2') {
      this.setData({
        nucleic2UploadFile: [],
        formData: Object.assign(this.data.formData, {
          NUCLEIC_ACID_TEST2: ''
        })
      })
    }
    if (e.currentTarget.dataset.type === 'nucleic3') {
      this.setData({
        nucleic3UploadFile: [],
        formData: Object.assign(this.data.formData, {
          NUCLEIC_ACID_TEST3: ''
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //上传图片
  uploadPic: async function (type) {
    //图片上传
    const upload = promisify(wx.uploadFile);
    const token = app.getToken();
    let imageUrl = '';
    let uploadFile = [];
    if (type === 'yuekang') {
      uploadFile = this.data.yuekangUploadFile;
    } else if (type === 'trip') {
      uploadFile = this.data.tripUploadFile;
    } else if (type === 'nucleic1') {
      uploadFile = this.data.nucleic1UploadFile;
    } else if (type === 'nucleic2') {
      uploadFile = this.data.nucleic2UploadFile;
    } else if (type === 'nucleic3') {
      uploadFile = this.data.nucleic3UploadFile;
    }

    if (uploadFile.length > 0) {
      for (let i = 0; i < uploadFile.length; i++) {
        try {
          const uploadres = await upload({
            url: fileEndUrl,
            filePath: uploadFile[i].url,
            name: 'file',
            header: {
              'systemName': 'prevention',
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
          this.setData({
            sending: false
          });
          return 'failed'
        }
      }
    } else {
      if (type === 'yuekang') {
        imageUrl = this.data.formData.YUE_KANG_CODE;
      } else if (type === 'trip') {
        imageUrl = this.data.formData.TRIP_CODE;
      } else if (type === 'nucleic1') {
        imageUrl = this.data.formData.NUCLEIC_ACID_TEST1;
      } else if (type === 'nucleic2') {
        imageUrl = this.data.formData.NUCLEIC_ACID_TEST2;
      } else if (type === 'nucleic3') {
        imageUrl = this.data.formData.NUCLEIC_ACID_TEST3;
      }
    }
    return imageUrl;
  },
  //提交表单
  async submit() {

    if (!this.data.sending) {
      const saveData = this.data.formData;

      if (util.isNull(saveData.YUE_KANG_CODE) && this.data.yuekangUploadFile.length == 0 && saveData.TIMES === 'first') {
        wx.showToast({
          title: '请上传粤康码',
          icon: 'none'
        })
        return
      }

      if (util.isNull(saveData.TRIP_CODE) && this.data.tripUploadFile.length == 0 && saveData.TIMES === 'first') {
        wx.showToast({
          title: '请上传行程码',
          icon: 'none'
        })
        return
      }

      if ((saveData.TYPE === '出行廣東省外') &&
        ((this.data.nucleic1UploadFile.length == 0 && saveData.TIMES === 'first' && util.isNull(saveData.NUCLEIC_ACID_TEST1)) ||
          (this.data.nucleic2UploadFile.length == 0 && saveData.TIMES === 'two' && util.isNull(saveData.NUCLEIC_ACID_TEST2)) ||
          (this.data.nucleic3UploadFile.length == 0 && saveData.TIMES === 'three' && util.isNull(saveData.NUCLEIC_ACID_TEST3)))) {
        wx.showToast({
          title: '请上传核酸检测',
          icon: 'none'
        })
        return
      }



      if (saveData.COLD_FLAG === 'Y' && util.isNull(saveData.REMARK)) {
        wx.showToast({
          title: '请填写具体症状',
          icon: 'none'
        })
        return
      }

      let sendConfirm = true;
      const showModal = promisify(wx.showModal);
      if (saveData.OK_FLAG === 'Y') {
        await showModal({
          title: '信息提醒',
          content: '你的信息已经审核过,不需要再提交',
        }).then(res => {
          sendConfirm = false;
        })
      }

      if (sendConfirm) {
        this.setData({
          sending: true
        });
        //图片上传
        const yuekangUrl = await this.uploadPic('yuekang');
        const tripUrl = await this.uploadPic('trip');
        const nucleic1Url = await this.uploadPic('nucleic1');
        const nucleic2Url = await this.uploadPic('nucleic2');
        const nucleic3Url = await this.uploadPic('nucleic3');
        if (yuekangUrl !== 'failed' && tripUrl !== 'failed' && nucleic1Url !== 'failed' && nucleic2Url !== 'failed' &&
          nucleic3Url !== 'failed') {
          wx.showLoading({
            title: '提交中',
            mask: true,
          })

          let postRes = await auth.request('POST', postData, Object.assign(saveData, {
            YUE_KANG_CODE: yuekangUrl,
            TRIP_CODE: tripUrl,
            NUCLEIC_ACID_TEST1: nucleic1Url,
            NUCLEIC_ACID_TEST2: nucleic2Url,
            NUCLEIC_ACID_TEST3: nucleic3Url,
            OK_FLAG: 'N'
          }));

          if (postRes && postRes.statusCode == 200) {

            wx.hideLoading()
            wx.navigateBack();
            wx.showToast({
              title: '提交成功',
              icon: 'none'
            })
          } else {
            wx.hideLoading()
            // wx.navigateBack();
            wx.showToast({
              title: '提交失败，请联系MIS',
              icon: 'none'
            })
            this.setData({
              sending: false
            });
          }
        }
      }
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