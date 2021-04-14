const util = require('../../utils/util');
const auth = require('../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
// components/serviceList/serviceList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    servicelist: {
      type: Object
    },
    type: {
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    handler: '',
    contact: '',
    serviceData: '',
    desc: ''
  },
  observers: {
    //   ['servicelist.HANDLER'](val) {
    //    var handlerList = val.split(','); 
    //    this.changeName(handlerList[0], 'CH(NO)').then((v)=>{
    //      this.setData({
    //        handler: v
    //      })
    //    });
    //  },
    ['servicelist.CONTACT'](val) {
      this.changeName(val, '{NICK_NAME} {TELEPHONE} / {MOBILE}').then((v) => {
        this.setData({
          contact: v
        })
      });
    },
    ['servicelist.SERVICE_DATE'](val) {
      let serviceData = val.slice(0, 10)
      this.setData({
        serviceData: serviceData
      })
    },
    ['servicelist.BX_TYPE'](val) {
      let desc;
      if (val === 'dorm') {
        desc = '宿舍报修预约';
      } else if (val === 'factory') {
        desc = '厂区报修预约';
      }
      this.setData({
        desc: desc
      })
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    async changeName(empno, params) {
      let res = await auth.request('GET', getUserUrl, {
        emp_name: empno
      })
      if (res && res.data && res.data.length > 0) {
        const data = res.data[0];
        const value = util.replaceQuery(params, data);
        const last = value
          .replace(/NO/g, data.EMPNO)
          .replace(/CH/g, data.NICK_NAME)
          .replace(/EN/g, data.USER_NAME);
        return last
      } else {
        return '';
      }
    },
    goToDistributeContent() {
      wx.navigateTo({
        url: `/pages/repair/distribute-content/distribute-content?data=${ JSON.stringify(this.properties.servicelist)}&type=distribute`,
      })
    }
  }
})