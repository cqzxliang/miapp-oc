const util = require('../../../utils/util');
const auth = require('../../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
const postServiceUrl = 'reservations/applications';
import moment, {
  months
} from 'moment';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmitValidate: true,
    type: '',
    serviceTime: '',
    handler:'',
    content: {

    },
    requiredRules: {
      required: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const scoreListId = options.id;
    const scoreList = wx.getStorageSync('scoreList');
    const data = scoreList.filter(e => e.ID == scoreListId);
    if (data.length > 0) {
      this.setData({
        content: data[0]
      })
    }
    
    let type;
    if (this.data.content.DEPT_ID == 1) {
      type = 'IT服务预约';
    } else if (this.data.content.DEPT_ID == 2) {
      type = '义诊预约';
    } else if (this.data.content.DEPT_ID == 3) {
      type = '宿舍/厂区报修预约';
    } else if (this.data.content.DEPT_ID == 4) {
      type = '按摩预约';
    }

    let time = this.data.content.START_TIME ? this.data.content.START_TIME + '~' + this.data.content.END_TIME : ''
    let serviceTime = this.data.content.SERVICE_DATE.slice(0, 10) + '  ' + time;

    var handlerList = this.data.content.HANDLER.split(','); 
    let  handler='';
    for (let i = 0; i < handlerList.length; i++) {
       const res = await this.changeName(handlerList[i],'CH(NO)');
       if(util.isNull(handler)){
        handler=res;
       }else{
        handler=handler+','+res;
       }
    }
    
    this.setData({
      type: type,
      serviceTime: serviceTime,
      handler:handler
    })

    wx.lin.initValidateForm(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  async changeName(empno, params) {
    let res = await auth.request('GET', getUserUrl, {
      emp_name: empno
    })
    if (res && res.data && res.data.length > 0) {
      const data = res.data[0];
      const value = util.replaceQuery(params,data);
      const last = value
      .replace(/NO/g, data.EMPNO)
      .replace(/CH/g, data.NICK_NAME)
      .replace(/EN/g, data.USER_NAME);
      return last
    } else {
      return '';
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
  changeScore(e) {
    this.setData({
      content: Object.assign(this.data.content, {
        SCORE: e.detail.score
      })
    })
  },
  changeComment(e) {
    this.setData({
      content: Object.assign(this.data.content, {
        USER_COMMENT: e.detail.value
      })
    })
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
 async submit(){
     if (this.data.content && this.data.content.SCORE>0) {
      wx.showLoading({
        title: '提交中',
        mask: true,
      });
      let data=  this.data.content;
      let res = await auth.request('POST', postServiceUrl, {
        ID: data.ID,
        DOCNO:data.DOCNO,
        SCORE:data.SCORE,
        USER_COMMENT:data.USER_COMMENT,
        STATUS:'Closed'
      });
      wx.hideLoading();
      wx.navigateBack();
      wx.showToast({
        title: '评价完成！',
        icon: 'none'
      })
    }else{
      wx.showToast({
        title: '请填写评分',
        icon: 'none'
      })
    }
  }
})