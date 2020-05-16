const puppeteer = require('puppeteer')
const fs =require('fs')
const cheerio = require('cheerio')
const {url,username,password} = require('./login')
/**
 * 延时器
 * @param delay 延长时间
 * @return {promise}
 */
function sleep(delay){
	return new Promise((resolve, reject) => {
		setTimeout(()=> {
			try{
				resolve(1)
			}catch(e){
				reject(e)
			}
		},delay)
	})
}
/**
 * 1.登录lazada(需绕过爬虫检测)
 * 2.一个个的获取买家信息
 */
async function lazada(){
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true, //是否在导航期间忽略 HTTPS 错误
		headless: false, //是否以无头方式运行
		slowMo: 50, //将操作时间设为200ms
		defaultViewport: { //设置默认视口大小
			width: 1920,
			height: 900
		},
		ignoreDefaultArgs:["--enable-automation"]
	})
	const page = await browser.newPage()

	try{
			console.log('开始爬虫...')
			//绕过lazada反爬虫检测
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, 'webdriver', {
					get: () => undefined
				})
			})

			//打开
			await page.goto(url, {waitUntil: 'networkidle2',timeout: 0})

      console.time('爬虫执行时间')
			//输入并触发登录
			await page.waitForSelector('input[name=TPL_username]',{timeout: 0})
			await page.type('input[name=TPL_username]', username)
			await page.waitForSelector('input[name=TPL_password]',{timeout: 0})
			await page.type('input[name=TPL_password]', password)
			const loginBtn = await page.waitForSelector('button[type=button]',{timeout: 0})
			await loginBtn.click()
      await page.waitFor(200)
			const isTrue = await page.$('#nc_1_n1z')
			//滑块验证
			if(isTrue){
					const span = await page.waitForSelector('#nc_1_n1z',{timeout: 0}) //等待滑块加载完成
					// console.log('滑块出现')
					const spanBox = await span.boundingBox() //获取滑块坐标
					// console.log(spanBox)
					await page.mouse.move(spanBox.x, spanBox.y) //鼠标移动到滑块上
					await page.mouse.down() //按下鼠标
					const divt = await page.waitForSelector('#nc_1__scale_text>.nc-lang-cnt',{timeout: 0}) //等待滑块容器加载完成
					const divBox = await divt.boundingBox() //获取滑块容器坐标
					// console.log(divBox)
					for(var i=0;i<divBox.width;i++){
						await page.mouse.move(spanBox.x+(i+50),spanBox.y)
					}
					await page.mouse.up()
					//验证完成继续登录
					const loginBtnBox = await page.waitForSelector('button[type=button]')
					await loginBtnBox.click()
			}
			//对话框页面的处理(划重点)
			await page.waitForSelector('ul.simple-tab.cb-tab>li')
			await page.waitForSelector('.scroll-content')
			await page.waitForSelector('.session-item.ripple')
			
			//关闭页面,浏览器
			console.timeEnd('爬虫执行时间')
			await page.close()
			await browser.close()
	}catch(e){
		console.log('错误原因',e)
	}
}

lazada()