const util = require('../../utils/util');
const auth = require('../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
// components/done-serviceList/done-serviceList.js
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
    contact: {
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  observers: {
    async  ['servicelist.STATUS'](val) {
       let status ='';
       let rank ='';
       if (val==='New'){
         status='待受理';
       }else if (val==='WAITING'){
        status='待签核';
      }else if (val==='Closed'){
        status='已结案';
      }else if (val==='Scoring'){
        status='待评分';
      }else if (val==='Processing'){
        status='处理中';
        // rank = await this.getRank(this.properties.servicelist.ID);      
      }
      this.setData({
        status: status
      })
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
    ['servicelist.CONTACT'](val) {
      this.changeName(val, '{NICK_NAME} {TELEPHONE} / {MOBILE}').then((v) => {
        this.setData({
          contact: v
        })
      });
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
        url: `/pages/repair/distribute-content/distribute-content?data=${ JSON.stringify(this.properties.servicelist)}&type=done`,
      })
    }
  }
})
