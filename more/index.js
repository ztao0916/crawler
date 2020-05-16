const puppeteer = require('puppeteer')
const async = require('async')

function sleep(time){
  return new Promise(function(resolve, rejct){
    setTimeout(() => {
      try {
        resolve(1)
      }catch(e){
        reject(e)
      }
    }, time)
  })
}

function getUrls(){
  //获取到所有的链接
  let urls = []
  for(let i = 0; i <= 225; i+=25) {
    urls.push('https://movie.douban.com/top250?start=' + i)
  }
  return urls
}

async function getDatas(browser,url){
  const page = await browser.newPage()
  await page.goto(url, {waitUntil: 'networkidle2'})
  await page.waitForSelector('.grid_view>li>.item')
  const data = await page.$$eval('.grid_view>li>.item', lis => {
    return lis.map(item => {
        let order = item.querySelector('em').innerText
        let title = item.querySelector('.title').innerText
        let rate = item.querySelector('.rating_num').innerText
        let url = item.querySelector('a').href
        return {
          order: Number(order),
          title: title,
          rate: rate,
          url: url
        }
    })
  })
  return data
}

;(async()=> {
  //创建一个浏览器
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true, //是否在导航期间忽略 HTTPS 错误
    args: [
      '–disable-gpu',
      '–disable-dev-shm-usage',
      '–disable-setuid-sandbox',
      '–no-first-run',
      '–no-sandbox',
      '–no-zygote',
      '–single-process'
    ],
    ignoreDefaultArgs:["--enable-automation"]
  })
  console.time('总时间:')
  let dataArr =[]
  async.mapLimit(getUrls(), 5,async (url, callback) => {
    const data = await getDatas(browser, url)
    dataArr.push(...data)
    
  },(err, result) => {
    if(err) throw err
    console.log(dataArr.length)
    console.timeEnd('总时间:')
  })

})()

