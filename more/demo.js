const async = require('async')

let concurrencyCount = 0;
function fetchUrl(url, callback){
  //delay的值在2000以内,是个随机的整数
  let delay = parseInt(Math.random() *2000)
  concurrencyCount++
  console.log(`现在的并发数是${concurrencyCount},正在抓取的是${url},耗时${delay}毫秒`)
  setTimeout(()=> {
    concurrencyCount --
    callback(null, url + 'html content')
  }, delay)
}

let urls = []
for(let i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i)
}

async.mapLimit(urls, 5, (url, callback) => {
  fetchUrl(url, callback)
}, (err, result) => {
  if(err) throw err
  console.log('final:')
  console.log(result)
})