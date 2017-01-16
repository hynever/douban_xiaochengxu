// pages/list/list.js

var xtrequest = require('../../utils/xtrequest.js')
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data:{
    items: [],
    requestStart: 0,
    url:''
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: options['name']
    })
    var url = ''
    if(options['name'] == '电影'){
      url = xtrequest.url.movieListUrl
    }else if(options['name'] == '电视剧'){
      url = xtrequest.url.tvListUrl
    }else{
      url = xtrequest.url.showListUrl
    }
    this.setData({
      url: url
    })
    // 加载数据
    this.refreshData()
  },
  refreshData: function(){
    var that = this
    
    xtrequest.getItemList({
      url: that.data.url+'/?start='+that.data.requestStart,
      success: function(data,items){
        var newItems = []
        for(var i=0; i<items.length; ++i){
          var hasSame = false
          for(var j=0; j< that.data.items;++j){
            if(items[i].id == that.data.items[j].id){
              hasSame = true
              break
            }
          }
          if(!hasSame){
            newItems.push(items[i])
          }
        }
        if(items.length >= 0){
            that.setData({
            items: that.data.items.concat(newItems),
            requestStart: that.data.requestStart+newItems.length
          })
        }
      }
    })
  },
  scrolltolower: function(){
    this.refreshData()
  }
})