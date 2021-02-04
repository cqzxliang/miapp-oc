const auth = require('../../core/auth');

Component({
  properties: {
    options: {
      type: Array,
      value: []
    },
    defaultOption: {
      type: Object,
      value: {
        id:' ',
        name:' '
      }
    },
    key: {
      type: String,
      value: 'id'
    },
    text: {
      type: String,
      value: 'name'
    }
  },
  data: {
    result: [],
    isShow: false,
    current: {}
  },
  methods: {
    optionTap(e) {
      
      let dataset = e.target.dataset
      this.setData({
        current: dataset,
        isShow: false
      });

      // 调用父组件方法，并传参
      this.triggerEvent("change", { ...dataset })
    },
    openClose() {
      
      this.setData({
        isShow: !this.data.isShow
      })
    },

    // 此方法供父组件调用
    close() {
      this.setData({
        isShow: false
      })
    },
    clean() {
      this.setData({
        current: {}
      })
    }
  },
  lifetimes: {
  async attached() {
      // 属性名称转换, 如果不是 { id: '', name:'' } 格式，则转为 { id: '', name:'' } 格式   
      const getUserUrl = 'Guid/GetUserLikeNoSite';

      let result = []
      if (this.data.key !== 'id' || this.data.text !== 'name') {       
        for (let item of this.data.options) {
          let { [this.data.key]: id, [this.data.text]: name } = item
          let res = await auth.request('GET', getUserUrl, {
            emp_name: id
          })
          result.push({ id, name:res.data[0].NICK_NAME })
        }
      }else{
        result = this.data.options;
      }
      this.setData({
        current: Object.assign({},this.data.defaultOption),
        result: result
      })
    }
  }
})