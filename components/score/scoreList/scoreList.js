const util = require('../../../utils/util');
const auth = require('../../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
// components/score/scoreList/scoreList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scorelist: {
      type: Object
    }
  },
  observers: {
    ['scorelist.HANDLER'](val) {
      var handlerList = val.split(',');
      this.changeName(handlerList[0], 'CH(NO)').then((v) => {
        this.setData({
          handler: v
        })
      });
    },
    ['scorelist.CONTACT'](val) {
      this.changeName(val, '{NICK_NAME} {TELEPHONE} / {MOBILE}').then((v) => {
        this.setData({
          contact: v
        })
      });
    },
    ['scorelist.SERVICE_DATE'](val) {
      let serviceData = val.slice(0, 10)
      this.setData({
        serviceData: serviceData
      })
    },
    ['scorelist.DEPT_ID'](val) {
      let type;
      if (val == 1) {
        type = 'IT服务预约';
      } else if (val == 2) {
        type = '义诊预约';
      } else if (val == 3) {
        type = '宿舍/厂区报修预约';
      } else if (val == 4) {
        type = '按摩预约';
      }
      this.setData({
        type: type
      })
    },
    ['servicelist.DEPT_ID'](val) {
      let type;
      if (val == 1) {
        type = 'IT服务预约';
      } else if (val == 2) {
        type = '义诊预约';
      } else if (val == 3) {
        type = '宿舍/厂区报修预约';
      } else if (val == 4) {
        type = '按摩预约';
      }
      this.setData({
        type: type
      })
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    handler: '',
    contact: '',
    serviceData: '',
    type: ''
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
    goToSocreContent() {
      wx.navigateTo({
        url: `/pages/score/score-content/score-content?id=${this.properties.scorelist.ID}`,
      })
    }
  }
})