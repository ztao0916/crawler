const puppeteer = require('puppeteer');
//自执行函数之前必须要有分号
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://example.com')
  // 生成png图片
  await page.screenshot({path:'baidu.png'})
  // 生成pdf
  await page.pdf({path:'baidu.pdf'})
  // 获取脚本的尺寸
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    }
  })
  console.log('dimensions', dimensions)
  await browser.close()
})()