// pages/detail/detail.js

var xtrequest = require('../../utils/xtrequest.js')

Page({
  data:{
    id: '',
    type: 1,
    item: null,
    tags: [],
    short: null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options['id'],
      type: options['type']
    })
    this.loadData()
  },
  loadData: function(){
    // 1. 加载详情的数据
    var that = this
    xtrequest.getItemDetail({
      id: that.data.id,
      type: that.data.type,
      success: function(res,data){
        that.setData({
          item: data
        })
      }
    })
    // 2. 加载8个标签数据 
    xtrequest.getItemTags({
      id: that.data.id,
      type: that.data.type,
      success: function(res,data){
        that.setData({
          tags: data
        })
      }
    })
    // 3. 加载前面三条短评的数据
    xtrequest.getItemShortComments({
      id: that.data.id,
      type: that.data.type,
      success: function(res,data){
        that.setData({
          short: data
        })
      }
    })
  }
})

// detail: https://m.douban.com/rexxar/api/v2/movie/<id>
// tags: https://m.douban.com/rexxar/api/v2/movie/<id>/tags?count=8
// 前三个短评：https://m.douban.com/rexxar/api/v2/movie/<id>/interests?count=3