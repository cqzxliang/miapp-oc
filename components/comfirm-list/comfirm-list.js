const util = require('../../utils/util');
const auth = require('../../core/auth');
const getUserUrl = 'Guid/GetUserLikeNoSite';
// components/comfirm-list/comfirm-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comfirmlist: {
      type: Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    contact: '',
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
    goToContent() {
      wx.navigateTo({
        url: `/pages/prevention/comfirm-content/comfirm-content?data=${ JSON.stringify(this.properties.comfirmlist)}`,
      })
    }
  },
  observers: {
    // ['comfirmlist.APPLY_EMPNO'](val) {
      
    //   this.changeName(val, ' {TELEPHONE} / {MOBILE}').then((v) => {
    //     this.setData({
    //       contact: v
    //     })
    //   });
    // },
  }
})
