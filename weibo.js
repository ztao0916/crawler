//自动发微博
const puppeteer = require('puppeteer')
const {username, password} = require('./config')

/**
 * 1. 抓取http://wufazhuce.com/的目标信息
 * 2. 等到微博把抓取到的内容写入微博并发布
 */
async function weibo(){
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true, //是否在导航期间忽略 HTTPS 错误
		headless: false, //是否以无头方式运行
		slowMo: 200, //将操作时间设为200ms
		defaultViewport: { //设置默认视口大小
			width: 1920,
			height: 900
		},
		ignoreDefaultArgs:['--enable-automation'] //忽略默认参数: 启用浏览器由自动化控制的指示
	})
	const page = await browser.newPage()
	//进入网页,抓取内容
	await page.goto('http://wufazhuce.com', {waitUntil: 'networkidle2'})
	await page.waitForSelector('.item')
	const writeContent = await page.$eval('.item>.fp-one-cita-wrapper>.fp-one-cita>a', link => link.innerText)
	page.close()
	//登录微博
	const wbPage = await browser.newPage()
	await wbPage.goto('https://weibo.com/',{waitUntil: 'networkidle2'})

		
	await wbPage.waitForSelector('input#loginname') //用户名框
	await wbPage.type('input#loginname', username)

	await wbPage.waitForSelector('input[type=password]') //密码框
	await wbPage.type('input[type=password]',password)

	const loginBtn = await wbPage.waitForSelector('a[action-type="btn_submit"]') //登录框
	await loginBtn.click()

	//登录完成以后
	await wbPage.waitForSelector('textarea.W_input') //输入框
	await wbPage.type('textarea.W_input', writeContent, {delay: 50}) //输入内容

	//发布
	const sendBtn = await wbPage.waitForSelector('a[node-type="submit"]')
  await sendBtn.click()
}

weibo()