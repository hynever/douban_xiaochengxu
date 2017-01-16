//index.js
//获取应用实例
var app = getApp()
var xtrequest = require('../../utils/xtrequest.js')
var util = require('../../utils/util.js')

Page({
  data: {
    modules: [{
        'title': '电影',
        'moreurl': 'xxx',
        'data': []
      },
      {
        'title': '电视剧',
        'moreurl': 'xxx',
        'data': []
      },
      {
        'title': '综艺',
        'moreurl': 'xxx',
        'data': []
      },
    ]
  },
  onLoad: function () {
    var that = this
    that.refreshData()
  },
  request: function(type){
    //1. 代表电影
    //2. 代表电视剧
    //3. 代表综艺
    var that = this
    // 在导航条显示正在刷新
    wx.showNavigationBarLoading()
    var url = ''
    if(type == 1){
      url = xtrequest.url.movieListUrl+"/?count=7"
    }else if(type == 2){
      url = xtrequest.url.tvListUrl+"/?count=7"
    }else{
      url = xtrequest.url.showListUrl+'/?count=7'
    }
    xtrequest.getItemList({
      url: url,
      success: function(data,items){
        if(type == 1){
          that.setData({
            'modules[0].data': items
          })
        }else if(type == 2){
          that.setData({
            'modules[1].data': items
          })
        }else{
          that.setData({
            'modules[2].data': items
          })
        }
        // 结束下拉刷新
        wx.stopPullDownRefresh()
        // 结束导航条的正在刷新
        wx.hideNavigationBarLoading()
      }
    })
  },
  refreshData: function(page=1){
    // 1. 获取电影数据
    this.request(1)
    // 2. 获取电视剧数据
    this.request(2)
    // 3. 获取综艺节目数据
    this.request(3)
  },
})