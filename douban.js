const puppeteer = require('puppeteer')


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
/**
 * 爬取豆瓣Top250电影(使用集群做)
 */
function douban(){
  (async()=> {
    //创建一个浏览器
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true, //是否在导航期间忽略 HTTPS 错误
      // headless: false, //是否以无头方式运行
      slowMo: 100, //将操作时间设为200ms
      defaultViewport: { //设置默认视口大小
        width: 1920,
        height: 900
      },
      ignoreDefaultArgs:["--enable-automation"]
    })

    //循环获取数据
    let dataArr = []
    const page = await browser.newPage()
    console.time('执行时间')
    for(let i=0; i<226; i+=25){
      await page.goto(`https://movie.douban.com/top250?start=${i}`, {waitUntil: 'networkidle2'})
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
      sleep(1000)
      dataArr.push(...data)
    }
    console.log(dataArr.length)
    console.timeEnd('执行时间')
    await browser.close()
  })();
}

douban()