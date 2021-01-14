// components/pagination/pagination.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     hasPrev: Boolean,
     prevUrl: String,
     hasNext: Boolean,
     nextUrl: String,
     redirect:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  pageLifetimes: {
    show() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    prev() {
      if (this.properties.hasPrev) {
           history.go(-1);
      }
    },
  
    next() {
      if (this.properties.hasNext) {
        if(this.properties.nextUrl === 'docs'){
          wx.navigateTo({
            url: '/pages/exit-factory/docs/docs'
          })
        }else if (this.properties.nextUrl ==='action-list'){
          if(this.properties.redirect){
            wx.redirectTo({
              url: '/pages/exit-factory/action-list/action-list'
            })
          }else{
            wx.navigateTo({
              url: '/pages/exit-factory/action-list/action-list'
            })
          }
        }
      }
    }
  }
})
