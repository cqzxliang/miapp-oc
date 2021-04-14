const auth = require('../../../core/auth');
const app = getApp();
const util = require('../../../utils/util');
const getAllTypeUrl = 'exfactory/alltypes';
const getBillTypesUrl = 'exfactory/billtypes';
const getHasBillUrl = 'exfactory/hasbill';
let allTypeData;
let typeArray = [];
let typeColumnArray = [];
let seletTypeId = -1;

const ComparisonTable = [{
    name: "GG",
    children: ["GG"]
  },
  {
    name: "F-",
    children: ["LL", "FF", "EK", "F-"]
  },
  {
    name: "HH",
    children: ["HH"]
  },
  {
    name: "FF",
    children: ["LL", "FF", "EK", "F-"]
  },
  {
    name: "LL",
    children: ["LL", "FF", "EK", "F-"]
  },
  {
    name: "HZ",
    children: ["HH"]
  },
  {
    name: "FT",
    children: ["FT"]
  },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [],
    docno: '',
    billtypeList: [],
    attachmentArray: [],
    hasNext: false,
  },
  bindMultiPickerChange: function (e) {
    
    this.setData({
      multiIndex: e.detail.value
    })

    if(e.detail.value === [0,0]){

    }
  },
  bindMultiPickerColumnChange: async function (e) {

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    if (this.data.multiIndex.length === 0) {
      data.multiIndex = [0, 0]
    }
    data.multiIndex[e.detail.column] = e.detail.value;

    if (e.detail.column == 0) {
      typeColumnArray = [];
      allTypeData.forEach(d => {
        if (d.T_KIND === typeArray[e.detail.value]) {
          typeColumnArray.push(d.T_NAME);
        }
      });
      data.multiIndex[1] = 0;
      data.multiArray = [
        [...typeArray],
        [...typeColumnArray]
      ];

      allTypeData.forEach(d => {
        if (d.T_NAME === typeColumnArray[0]) {
          seletTypeId = d.ID;
          wx.setStorageSync('createType', {
            typeId: seletTypeId,
            typeName: d.T_NAME
          });
          this.setData({
            hasNext: true
          });
        }
      });
    } else if (e.detail.column == 1) {
      allTypeData.forEach(d => {
        if (d.T_NAME === typeColumnArray[e.detail.value]) {
          seletTypeId = d.ID;
          // app.setCreateType({
          //   typeId: seletTypeId,
          //   typeName: d.T_NAME
          // });
          wx.setStorageSync('createType', {
            typeId: seletTypeId,
            typeName: d.T_NAME
          });
          this.setData({
            hasNext: true
          });
        }
      });
    }
    this.setData(data);
    const res = await auth.request('GET', getBillTypesUrl, {
      id: seletTypeId
    });
    if (res) {
      this.setData({
        billtypeList: res.data
      });
    } else {
      this.setData({
        billtypeList: []
      });
    }
  },
  inputInfo: function (e) {
    // let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    this.setData({
      docno: value
    })
  },
  clearInput: function (e) {
    this.setData({
      docno: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setStorageSync('goodList', [])
    wx.setStorageSync('createContent', {})
    wx.setStorageSync('attachmentList', [])
    wx.setStorageSync('createType', {})
    wx.setStorageSync('signList', []);

    const res = await auth.request('GET', getAllTypeUrl, {});
    if (res) {
      allTypeData = res.data;
      allTypeData.forEach(d => {
        if (typeArray.indexOf(d.T_KIND) == -1) {
          typeArray.push(d.T_KIND);
        }
      });
      allTypeData.forEach(d => {
        if (d.T_KIND === typeArray[0]) {
          typeColumnArray.push(d.T_NAME);
        }
      });
      this.multiArray = [typeArray, typeColumnArray];
      var data = {
        multiArray: [
          [...typeArray],
          [...typeColumnArray]
        ],
        multiIndex: [0,0]
      };

      allTypeData.forEach(d => {
        if (d.T_NAME === typeColumnArray[0]) {
          wx.setStorageSync('createType', {
            typeId: d.ID,
            typeName: d.T_NAME
          });
          this.setData({
            hasNext: true
          });
        }
      });

      this.setData(data);

    }


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
  onUnload: function () {},

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
  deleteAttachment(e) {
    wx.showModal({
      title: '删除捡附单据',
      content: '确定要删除这张捡附单？',
      success: (res) => {
        if (res.confirm) {
          const i = e.currentTarget.dataset.i;
          this.data.attachmentArray.splice(i, 1);
          this.setData({
            attachmentArray: this.data.attachmentArray
          });
          wx.setStorageSync('attachmentList', this.data.attachmentArray);
          // app.setAttachmentList(this.data.attachmentArray);
        } else if (res.cancel) {}
      }
    })
  },
  addAttachment() {
    let validError = true;
    let validString = this.data.docno.toUpperCase().substring(0, 2); // 轉大寫字母並截取前兩位對比
    let oldbillList = this.data.billtypeList.map(v => {
      return v.NAME.replace(/(\s*$)/, "")
    });
    let billList = [];
    ComparisonTable.forEach(e => {
      if (oldbillList.indexOf(e.name) > -1) {
        billList = billList.concat(e.children);
      }
    });
    let newbillList = [];
    billList.forEach(b => {
      if (newbillList.indexOf(b) === -1) {
        newbillList.push(b);
      }
    })
    if (!newbillList.includes(validString)) {
      validError = true;
    } else {
      validError = false;
    }
    if (!validError) {
      auth.request('GET', getHasBillUrl, {
        type: newbillList.toString(),
        reqno: this.data.docno
      }).then((res) => {
        if (res.data.indexOf(this.data.docno.toUpperCase()) > -1) {
          if (this.data.attachmentArray.indexOf(this.data.docno.toUpperCase()) > -1) {
            wx.showToast({
              title: '该单据已添加',
              icon: 'none'
            })
            return;
          } else {
            this.setData({
              attachmentArray: this.data.attachmentArray.concat(this.data.docno)
            })
            wx.setStorageSync('attachmentList', this.data.attachmentArray);
            // app.setAttachmentList(this.data.attachmentArray);
          }

        } else {
          wx.showToast({
            title: '请输入正确的单据号',
            icon: 'none'
          })
          return;
        }
      });
    } else {
      wx.showToast({
        title: '请输入对应的捡附单类型单据编号',
        icon: 'none'
      })
    }

  },
})