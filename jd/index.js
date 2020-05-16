const puppeteer = require('puppeteer')
const fs =require('fs')
const path = require('path')
const json2csv = require('json2csv')
const cheerio = require('cheerio')

const siteConfig = require('./config.site.js')

fs.writeFile('文件.txt', 'Node.js中文网', 'utf8', err => {
  if(err) throw err
  console.log('文件保存成功')
})

//延迟执行时间
function sleep(delay){
   return new Promise((resolve, reject) => {
      setTimeout(()=> {
        try {
          resolve(1)
        }catch(e){
          reject(e)
        }
      },delay)
   })
}

/**
 * [一.按顺序进入页面抓取需要的内容信息json格式;二.把抓取到的信息写入csv文件,同时在当前目录下创建csv文件]
 * @param {Object}siteConfig 站点配置
 * @return {Promise}
 */
async function jd(siteConfig){
    try {
        //创建一个浏览器对象
      const browser = await puppeteer.launch({
        executablePath: 'C:\\nvm\\v10.16.0\\node_modules\\puppeteer\\.local-chromium\\win64-722234\\chrome-win\\chrome.exe'
      })

      const siteProcess = []

      const fields = await siteConfig.fields.map(item => {
        return {
          label: item.name,
          value: `skuInfo.${item.key}`,
          default: 'NULL'
        }
      })
     
      siteConfig.urls.forEach(url => {
        siteProcess.push(() => {
          console.log(`> 开始获取${url}的页面数据...`)
          return getSku(browser, url, siteConfig.site)
        })
      })
      for(let [index,item] of siteProcess.entries()){
        const val = await item()
        console.log(val)
      }
      
      await browser.close()
    }catch(e){
      console.log(e)
    }
}

/**
 * 获取详情页的url列表
 * @param {Object}browser 浏览器对象
 * @param {String}url 链接
 * @param {Array}sites 对象数组
 * @return {Object} Promise
 */

 async function getSku(browser, url, sites) {
    try {
      const siteInfo = sites.find(item => {
        if(item.is(url)){
          return item
        }
      })
  
      //siteInfo不存在,返回一个promise对象
      if (!siteInfo){
        return {
          siteInfo: {},
          skuLink: url,
          skuInfo: {}
        }
      }
      
      //获取了html结构
      const $html = await puppeteerHtml(browser, url, siteInfo)
  
      //获取json对象
      let skuInfo = {}
      if($html){
        const $ = cheerio.load($html)
        siteInfo.skuContentArr.forEach(item => {
          skuInfo[item.name] = item(url, $)
        })
        console.log(`>> 成功获取: ${url}`)
      }else{
        skuInfo = {}
        console.error(`>> 获取${url}商品信息失败!`)
      }
  
      return {
        siteInfo,
        skuLink: url,
        skuInfo
      }
    }
    catch(e){
      console.log(`>> 解析 ${url} 页面中的商品数据失败: ${JSON.stringify(data)}`)
      return {
        siteInfo: siteInfo,
        skuLink: url,
        skuInfo: {}
      }
    }



 }

 /**
  * 获取文档的标准HTML结构
  * @param {Object}browser 浏览器对象
  * @param {String}url 页面链接
  * @return {Object}  <Promise>
*/
async function puppeteerHtml(browser, url, siteInfo){
      //创建一个页面对象
      const page = await browser.newPage()

      // 设置完成请求的时机
      // if (siteInfo.onDetailPageLoaded) siteInfo.onDetailPageLoaded(url, page)
      // 设置超时时间
      await page.setDefaultNavigationTimeout(10000)
      // 设置页面请求可被截取
      await page.setRequestInterception(true)
      page.on('request', interceptedRequest => {
        const urlObj = interceptedRequest.url()
        if (urlObj.endsWith('.png') || urlObj.endsWith('.jpg'))
          interceptedRequest.abort()
        else
          interceptedRequest.continue()
      })

      await page.goto(url, {waitUntil: 'networkidle2'})

      const content = await page.content()

      return content
}

jd(siteConfig)