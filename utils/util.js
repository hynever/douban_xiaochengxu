function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function log(params){
  console.log('----------')
  console.log(params)
  console.log('----------')
}

function formatRate(value){
  var lights = []
  var halfs = []
  var grays = []
  if(value){
    var light = parseInt(value/2)
    var half = parseInt(value)%2
    var gray = 5 - light - half

    for(var j = 0;j<light; j++){
        lights.push(j)
    }
    for(var j=0; j<half;j++){
        halfs.push(j)
    }
    for(var j=0;j<gray;j++){
        grays.push(j)
    }    
    // 设置评分值只有最后以为小数
    value = value.toFixed(1)
}else{
    value = '无评分'
    lights = []
    halfs = []
    grays = [1,2,3,4,5]
  }
  return {
    'lights': lights,
    'halfs': halfs,
    'grays': grays,
    'value': value
  }
}

module.exports = {
  formatTime: formatTime,
  log: log,
  formatRate: formatRate
}
