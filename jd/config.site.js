'use strict';

module.exports = {
  urls: ['https://item.jd.com/1238701404.html','https://item.jd.com/1110809080.html'],
  //urls: ['https://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.1.269c745ayQE9ph&id=527075698825&sku_properties=1627207:909850991'],
  //urls: ['https://www.baidu.com'],
  fields: [
    { key:'site', name: '电商名称' }, 
    { key:'sku_id', name: 'SKU ID' }, 
    { key:'sku_name', name: '商品名称' }, 
    { key:'brand', name: '品牌' }, 
    { key:'price', name: '售价' }, 
    { key:'sales_num', name: '销量' }, 
    { key:'size', name: '尺寸' }, 
    { key:'color', name: '颜色' }, 
    { key:'material', name: '材质' }, 
    { key:'lock', name: '锁' }, 
    { key:'weight', name: '毛重' }, 
    { key:'supplier', name: '供应商' }, 
    { key:'link', name: '链接' }
  ],
  site: [{
    name: '京东',

    is: function(url) {
      return url.indexOf('jd.com') > -1
    },

    skuContentArr: [
      function site (_url, $){ return '京东'; } , //返回京东
      function link (_url, $){ return _url } , //返回链接
      function sku_id (_url, $){ return _url.match(/jd\.com\/(.+)\.html/)[1] } , //返回匹配链接的itemId
      function sku_name (_url, $){
        return $('.product-intro .sku-name').text().trim()  //产品标题
      },
      function brand (_url, $){
        return $('#parameter-brand').text().replace('品牌：', '').trim() //获取品牌
      },
      function price (_url, $){
        return $('.summary-price .p-price .price').text().trim() //价格
      },
      function sales_num (_url, $){
        return $('#comment-count .count').text().trim() //销量
      },
      function size (_url, $){
        let ageArr = $('.parameter2').text().split('\n').filter(item => item.indexOf('尺寸：') > -1) || []
        return ageArr[0] ? ageArr[0].replace('尺寸：', '').trim() : '无法获取'
      },
      function color (_url, $){
        let ageArr = $('.parameter2').text().split('\n').filter(item => item.indexOf('颜色：') > -1) || []
        return ageArr[0] ? ageArr[0].replace('颜色：', '').trim() : '无法获取'
      },
      function material (_url, $){
        let ageArr = $('.parameter2').text().split('\n').filter(item => item.indexOf('材质：') > -1) || []
        return ageArr[0] ? ageArr[0].replace('材质：', '').trim() : '无法获取'
      },
      function lock (_url, $){
        let ageArr = $('.parameter2').text().split('\n').filter(item => item.indexOf('锁具方式：') > -1) || []
        return ageArr[0] ? ageArr[0].replace('锁具方式：', '').trim() : '无法获取'
      },
      function weight (_url, $){
        let ageArr = $('.parameter2').text().split('\n').filter(item => item.indexOf('商品毛重：') > -1) || []
        return ageArr[0] ? ageArr[0].replace('商品毛重：', '').trim() : '无法获取'
      },
      function supplier (_url, $){ //供应商
        return $('.summary-service .hl_red').text().trim()
      }
    ]
  }, {
    name: '天猫',

    is: function(url) {
      return url.indexOf('detail.tmall.com') > -1 //判断是不是天猫
    },

    skuContentArr: [
      function site (_url, $){ return '天猫' } , //返回平台
      function link (_url, $){ return _url } , //返回sku链接
      function sku_id (_url, $){ return _url.match(/id=(\d+)/)[1] },//返回sku_id
      function sku_name (_url, $){
        return $('#J_DetailMeta h1').text().trim() //商品标题
      },
      function brand (_url, $){
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text())})
        let findOne = arr.find(item => item.indexOf('品牌:') > -1) || ''
        return findOne.replace('品牌:', '').trim() || '无法获取'
      },
      function price (_url, $){
        return $('.tm-promo-price .tm-price').text().trim() //价格
      },
      function sales_num (_url, $){
        return $('.tm-ind-sellCount .tm-count').text().trim() //销量
      },
      function size (_url, $){ //尺寸
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text())})
        let findOne = arr.find(item => item.indexOf('尺寸:') > -1) || ''
        return findOne.replace('尺寸:', '').trim() || '无法获取'
      },
      function color (_url, $){ //颜色
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text())})
        let findOne = arr.find(item => item.indexOf('图案:') > -1) || ''
        return findOne.replace('图案:', '').trim() || '无法获取'
      },
      function material (_url, $){ //质地
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text())})
        let findOne = arr.find(item => item.indexOf('质地:') > -1) || ''
        return findOne.replace('质地:', '').trim() || '无法获取'
      },
      function lock (_url, $){ 
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text())})
        let findOne = arr.find(item => item.indexOf('锁的类型:') > -1) || ''
        return findOne.replace('锁的类型:', '').trim() || '无法获取'
      },
      function weight (_url, $){
        let arr = [];
        $('#J_AttrUL li').each((index, item)=> {arr.push($(item).text());});
        let findOne = arr.find(item => item.indexOf('商品毛重:') > -1) || ''
        return findOne.replace('商品毛重:', '').trim() || '无法获取'
      },
      function supplier (_url, $){ //供应商
        return $('.slogo-shopname').text().trim()
      }
    ]
  }]
};
