
const util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmitValidate:true,
    index:'',
    goodList:[],
    goodItem:{

    },
    actQTYRules:[
    {
      validator(rule, value, callback,source) {
        const {QTY_USE,NOT_USE,QTY} = source;
        if(QTY>0){
          if(QTY_USE > NOT_USE) {
            callback(false);
          }
        } 
        callback()
      },
      message: '实际出货数量不能大于剩余数量',
      trigger: 'change'
    },
    {
      validator(rule, value, callback,source) {
        const {QTY_USE} = source;
        if(QTY_USE>0){
        } else{
          callback(false);
        }
        callback()
      },
      message: '实出数量要大于0',
      trigger: 'change'
    },
    {
      type: 'number',
      required: true
    },
    
   ],
   requiredRules:[
    {
      required: true,
    }
   ],
  dialogshow:false,
  formError:false,
  newFlag:false,
  qtyUseError:false,
  partNoError:false,
  descError:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const index = options.index;
    const goodList =wx.getStorageSync('goodList');
    let goodItem;
    let newFlag;
    if(options.newFlag==='1'){
      newFlag = true;
      goodItem = {
        PART_NO: '',
        PART_DESCRIPTION:'',
        CHINESE_DESC:'',
        UOM:'',
        COST:'',
        QTY:'--',
        REQ_NO:'',
        NOT_USE:'--',
        QTY_USE:'',
        LIST_NO:''
   };
    }else if(options.newFlag==='2'){
      newFlag = false;
      goodItem = goodList[index];
    }
    this.setData({newFlag:newFlag,index:index,goodList:goodList,goodItem:goodItem});
    wx.lin.initValidateForm(this)
  },
  save(){
     wx.lin.submitForm('goodItem');
  },
  submit(page){
    if(!this.data.qtyUseError&& !this.data.partNoError&& !this.data.descError){
      let saveData = page.detail.values;
      if(util.isNull(saveData.LIST_NO)){
        saveData.QTY= saveData.QTY_USE;
      };
      // if()
      if(this.data.newFlag){
        this.data.goodList = this.data.goodList.concat(saveData);     
      }else {
        this.data.goodList[this.data.index] = saveData;
      }
      wx.setStorageSync('goodList', this.data.goodList);
      wx.navigateBack();
    }

    /*this.data.goodList[this.data.index] = saveData;
    wx.setStorageSync('goodList', this.data.goodList);
    wx.navigateBack();*/
  },
  delete(){
    this.setData({dialogshow:true});
  },
  deleteConfirm(){
    this.data.goodList.splice(this.data.index,1);
    wx.setStorageSync('goodList', this.data.goodList);
    wx.navigateBack();
  },
  qtyUseCheck(re){
    this.setData({qtyUseError:re.detail.isError})
  },
  partNoCheck(re){
    this.setData({partNoError:re.detail.isError})
  },
  descCheck(re){
    this.setData({descError:re.detail.isError})
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

  }
})