import moment from 'moment';
const auth = require('../../../core/auth');
const app = getApp();
const util = require('../../../utils/util');
const getEFDataListUrl = 'exfactory/EFModifyList';
const updateBillListUrl = 'exfactory/editBillNumber';
let page = 1;
const pageCount = 5;
let created_by='';
let p_no='';
let list_no='';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList:[],
    showList:[],
    showModal: false,
    modifyLineId: 0,
    modifyQty: 0 ,
    modifyQtyTemp: 0 ,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let user = app.getUserInfo();
    created_by=user.ID;
    p_no = options.p_no;
    list_no = options.list_no
    const searchData = {
      created_by: user.ID,
      p_no: options.p_no,
      list_no: options.list_no
    }
    const res = await auth.request('GET', getEFDataListUrl, searchData);
    if (res && res.data && res.data.length > 0) {
      page = 1;
      const showList = res.data.slice(0,pageCount);
      this.setData({
        searchList: res.data,
        showList:showList
      });
    } else {
      wx.showToast({
        title: '没有对应的查询记录',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showModify(event){
    const item = event.currentTarget.dataset.item;
    this.setData({
      showModal:true,
      modifyLineId: item.ID,
      modifyQty: item.QTY_USE ,
      modifyQtyTemp: item.QTY_USE 
    })
  },
  modal_click_Hidden: function () {
    this.setData({
      showModal: false,
    })
  },
  changeModifyQty(event){
      this.setData({
        modifyQty: event.detail.value
      })
  },
  // 确定
  Sure:async function () {
    if ( +this.data.modifyQty + 1>1 ){
        if(this.data.modifyQty >this.data.modifyQtyTemp){
          wx.showToast({
            title: '数量不能比修改之前大',
            icon:'none'
          })
          return
        }
        let postData = {
          ID:this.data.modifyLineId,
          QTY_USE:this.data.modifyQty
        }
        const res = await auth.request('POST', updateBillListUrl, postData);
        if(res.data){
          const searchData = {
            created_by: created_by,
            p_no: p_no,
            list_no: list_no
          }
          const res = await auth.request('GET', getEFDataListUrl, searchData);
          if (res && res.data && res.data.length > 0) {
            page = 1;
            const showList = res.data.slice(0,pageCount);
            this.setData({
              searchList: res.data,
              showList:showList
            });
          }
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
          this.setData({
            showModal: false,
          })


        }else {
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
        }
    }else{
      wx.showToast({
        title: '请填写正确的数量',
        icon:'none'
      })
      return
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
    if(page * pageCount < this.data.searchList.length){
      const addList = this.data.searchList.slice(page*pageCount,(page+1)*pageCount);
      this.setData({
        showList: this.data.showList.concat(addList)
      });
      page=page+1;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})