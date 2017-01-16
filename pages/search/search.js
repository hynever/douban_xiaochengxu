// pages/search/search.js

var xtrequest = require('../../utils/xtrequest.js')

Page({
  data:{
    histories: [],
    hots: [],
    searchResult: []
  },
  onLoad:function(options){
    this.loadHotSearch()
    this.getHistories()
  },
  loadHotSearch: function(){
    var that = this
    xtrequest.getHotSearch({
      success: function(res,data){
        var hots = []
        var length = data.length > 5 ? 5 : data.length
        for(var i=0; i < length; i++){
          var name = data[i].name
          var uriItems = data[i].uri.split('/')
          var id = uriItems.pop()
          var type = uriItems.pop() == 'movie' ? 1: 2
          hots.push({
            name: name,
            id: id,
            type: type
          })
        }
        that.setData({
          hots: hots
        })
      }
    })
  },
  getHistories: function(){
    var that = this
    wx.getStorage({
      key: 'histories',
      success: function(res){
        var data = res.data
        that.setData({
          'histories': data
        })
      },
    })
  },
  gotoDetail: function(event){
    var dataset = event.currentTarget.dataset
    var id = dataset['id']
    var type = dataset['type']
    var name = dataset['name']

    var addHistories = function(data){
      if(!data){data = []}
      var hasValue = false
      for(var i=0; i < data.length; i++){
        if(data[i].id == id){
          hasValue = true
          break
        }
      }
      if(!hasValue){
        data.push({
          id: id,
          type: type,
          name: name
        })
        wx.setStorage({
          key: 'histories',
          data: data,
        })
      }
    }

    wx.navigateTo({
      url: '../detail/detail?id='+id+'&type='+type+'&name='+name,
      complete: function() {
        // 存储历史数据
        wx.getStorage({
          key: 'histories',
          success: function(res){
            var data = res.data
            if(! (data instanceof Array)){
              data = null
            }
            addHistories(data)
          },
          complete: function() {
            addHistories(null)
          }
        })
      }
    })
  },
  clearHistories: function(){
    var that = this
    wx.removeStorage({
      key: 'histories',
      success: function(){
        that.setData({
          histories: null
        })
      }
    })
  },
  inputEvent: function(event){
    wx.showNavigationBarLoading()
    var that = this
    var value = event.detail
    // 发送请求
    xtrequest.getSearch({
      q: value,
      success: function(res,data){
        console.log(data)
        that.setData({
          searchResult: data
        })
      },
      complete: function(){
        wx.hideNavigationBarLoading()
      }
    })
  }
})

// https://m.douban.com/rexxar/api/v2/search?q=%E5%AD%A4%E8%8A%B3&type=movie
// 热门搜索
// https://m.douban.com/rexxar/api/v2/search/hots?type=movie