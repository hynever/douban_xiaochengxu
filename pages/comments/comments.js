// pages/comments/comments.js
var xtrequest = require('../../utils/xtrequest.js')


Page({
  data:{
    itemData: {},
    short: {},
    start: 1,
    count: 20,
    scrollTop: 0,
    preLoading: false,
    nextLoading: false,
  },
  onLoad:function(options){
    options['type'] = options['type'] == 'movie' ? 1 : 2
    this.setData({
      itemData: options
    })
    this.loadData({})
  },
  loadData: function(params){
    var that = this
    var start = params['start'] ? params['start'] : 0; 
    var success = params['success']
    xtrequest.getItemShortComments({
      id: that.data.itemData.id,
      start: that.data.start,
      count: that.data.count,
      type: that.data.itemData.type,
      success: function(res,data){
        that.setData({
          short: data,
          start: that.data.start + data.interests.length
        })
        if(success){
          success()
        }
      },
      complete: function(){
        that.setData({
          preLoading: false,
          nextLoading: false
        })
      }
    })
  },
  preBtnClick: function(){
    var that = this
    // 只有不是在第一页的时候才加载数据
    if(that.data.start > 0){
      that.setData({
        preLoading: true
      })
      that.loadData({
        start: that.data.start-that.data.short.interests.length,
        success: function(){
          // 滚动到起始位置
          that.setData({
            scrollTop: 0
          })
        }
      })
    }
  },
  nextBtnClick: function(){
    var that = this
    if(that.data.short.interests.length == that.data.count){
      console.log('next coming...')
      that.setData({
        nextLoading: true
      })
      that.loadData({
        start: that.data.start+that.data.short.interests.length,
        success: function(){
          // 滚动到起始位置
          that.setData({
            scrollTop: 0
          })
        }
      })
    }
  },
  back:function(){
    wx.navigateBack()
  }
})