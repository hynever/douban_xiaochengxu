var util = require('util.js')


var xtrequest = {
    url: {
        movieListUrl: 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items',
        tvListUrl: 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_hot/items',
        showListUrl: 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_variety_show/items',
        movieDetailUrl: function(id){
            return 'https://m.douban.com/rexxar/api/v2/movie/'+id
        },
        movieTagsUrl: function(id){
            return 'https://m.douban.com/rexxar/api/v2/movie/'+id+'/tags?count=8'
        },
        movieShortCommentUrl: function(id,start=0,count=3){
            return 'https://m.douban.com/rexxar/api/v2/movie/'+id+'/interests?count='+count+'&start='+start
        },
        tvDetailUrl: function(id){
            return 'https://m.douban.com/rexxar/api/v2/tv/'+id
        },
        tvTagsUrl: function(id){
            return 'https://m.douban.com/rexxar/api/v2/tv/'+id+'/tags?count=8'
        },
        tvShortCommentUrl: function(id,start=0,count=3){
            return 'https://m.douban.com/rexxar/api/v2/tv/'+id+'/interests?count='+count+'&start='+start
        },
        showDetailUrl: function(id){
            return this.tvDetailUrl(id)
        },
        showTagsUrl: function(id){
            return this.tvTagsUrl(id)
        },
        showShortCommentUrl: function(id,start=0,count=3){
            return this.tvShortCommentUrl(id,start,count)
        },
        hotSearchUrl: 'https://m.douban.com/rexxar/api/v2/search/hots?type=movie',
        searchUrl: function(q){
            return 'https://m.douban.com/rexxar/api/v2/search?type=movie&q='+ encodeURI(q)
        }
    },
    request: function(params){
        wx.request({
            url: params['url'],
            data: params['data'] ? params['data'] : [],
            success: function(res){
                if(params['success']){
                    params['success'](res)
                }
            },
            fail: function() {
                if(params['faial']){
                    params['fail']()
                }
            },
            complete: function() {
                if(params['complete']){
                    params['complete']()
                }
            }
        })
    },
    get: function(params){
        params['method'] = 'GET'
        this.request(params)
    },
    post: function(params){
        params['method'] = 'POST'
        this.request(params)
    },
    getItemList: function(params){
        var that = this
        var url = params['url']
        var success = params['success']
        var fail = params['fail']
        var complete = params['complete']
        this.get({
            url: url,
            success: function(res){
                if(res.statusCode == 200){
                    const data = res.data
                    var items = data.subject_collection_items
                    for(var i=0; i< items.length; i++){
                        var item = items[i]
                        if(!item['rating']){{
                            item['rating'] = {}
                        }}
                        var formatedRate = util.formatRate(item['rating']['value'])
                        items[i].rating['light'] = formatedRate.lights
                        items[i].rating['half'] = formatedRate.halfs
                        items[i].rating['gray'] = formatedRate.grays
                        items[i].rating['value'] = formatedRate.value
                        items[i].type = items[i].type == 'movie' ? 1 : 2
                    }
                    if(success){
                        success(res.data,items)
                    }
                }
            },
            fail: function() {
                wx.showToast({'title': '网络错误'})
                if(fail){
                    fail()
                }
            },
            complete: function(){
                if(complete){
                    complete()
                }
            }
        })
    },
    getItemDetail: function(params){
        var type = params['type']
        var id = params['id']
        var success = params['success']
        var fail = params['fail']
        var complete = params['complete']
        var url = ''
        if(type == 1){
            url = this.url.movieDetailUrl(id)
        }else if(type == 2){
            url = this.url.tvDetailUrl(id)
        }else{
            url = this.url.showDetailUrl(id)
        }
        this.get({
            url: url,
            fail: fail,
            complete: complete,
            success: function(res){
                var data = res.data
                var formatedRate = util.formatRate(data.rating['value'])
                data.rating['light'] = formatedRate.lights
                data.rating['half'] = formatedRate.halfs
                data.rating['gray'] = formatedRate.grays
                data.rating['value'] = formatedRate.value
                data.genres = data.genres.join(' / ')
                var directors = data.directors
                var actors = data.actors
                var directorNames = []
                var actorNames = []
                if(data.directors.length > 3){
                    directors = directors.slice(0,3)
                }
                if(data.actors.length > 3){
                    actors = actors.slice(0,3)
                }
                for(var i=0; i < directors.length; ++i){
                    directorNames.push(directors[i].name+'(导演)')
                }
                for(var j=0; j< actors.length; ++j){
                    if(actors[j].name){
                        actorNames.push(actors[j].name)
                    }
                }
                data.authors = directorNames.concat(actorNames).join(' / ')
                if(success){
                    success(res,data)
                }
            }
        })
    },
    getItemTags: function(params){
        var type = params['type']
        var id = params['id']
        var success = params['success']
        var fail = params['fail']
        var complete = params['complete']
        var url = ''
        if(type == 1){
            url = this.url.movieTagsUrl(id)
        }else if(type == 2){
            url = this.url.tvTagsUrl(id)
        }else{
            url = this.url.showTagsUrl(id)
        }
        this.get({
            url: url,
            fail: fail,
            complete: complete,
            success: function(res){
                var data = res.data
                if(success){
                    success(res,data.tags)
                }
            }
        })
    },
    getItemShortComments: function(params){
        var type = params['type']
        var id = params['id']
        var success = params['success']
        var fail = params['fail']
        var complete = params['complete']
        var start = params['start'] ? params['start'] : 0
        var count = params['count'] ? params['count'] : 3
        var url = ''
        if(type == 1){
            url = this.url.movieShortCommentUrl(id,start,count)
        }else if(type == 2){
            url = this.url.tvShortCommentUrl(id,start,count)
        }else{
            url = this.url.showShortCommentUrl(id,start,count)
        }
        this.get({
            url: url,
            fail: fail,
            complete: complete,
            success: function(res){
                var data = res.data
                var comments = data.interests
                for(var i=0; i<comments.length; ++i){
                    if(comments[i]['rating']){
                        var formatedRate = util.formatRate(comments[i]['rating']['value'])
                        comments[i]['rating']['lights'] = formatedRate['lights']
                        comments[i]['rating']['halfs'] = formatedRate['halfs']
                        comments[i]['rating']['grays'] = formatedRate['grays']
                    }else{
                        comments[i]['rating'] = {
                            'lights': [],
                            'halfs': [],
                            'grays': [1,2,3,4,5]
                        }
                    }
                }
                if(success){
                    success(res,data)
                }
            }
        })
    },
    getHotSearch: function(params){
        var success = params['success']
        this.get({
            url: this.url.hotSearchUrl,
            success: function(res){
                if(success){
                    var data = res.data.items
                    success(res,data)
                }
            }
        })
    },
    getSearch: function(params){
        var that = this
        var q = params['q']
        var success = params['success']
        var complete = params['complete']
        this.get({
            url: that.url.searchUrl(q),
            success: function(res){
                var data = res.data.subjects
                for(var i=0; i< data.length; i++){
                    var item = data[i]
                    if(item['rating']['value']){
                        item['rating']['value'] = item['rating']['value'].toFixed(1) 
                    }else{
                        item['rating']['value'] = '无评'
                    }
                    item['type'] = item['type']=='movie'? 1 : 2 
                }
                if(success){
                    success(res,data)
                }
            },
            complete: function(){
                if(complete){
                    complete()
                }
            }
        })
    }
}

module.exports = xtrequest