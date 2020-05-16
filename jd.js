const puppeteer = require('puppeteer')
//延时500ms函数
function sleep(delay){
	return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					resolve(1)
				}catch(e){
					reject(0)
				}
			}, delay);
	})
}

/**
 * 1. 创建浏览器对象
 * 2. 调用浏览器对象创建页面对象
 * 3. 操作页面对象
 */
async function jd(){
		const browser = await puppeteer.launch({
			ignoreHTTPSErrors: true, //是否在导航期间忽略 HTTPS 错误
			// headless: false, //是否以无头方式运行
			slowMo: 200, //将操作时间设为200ms
			defaultViewport: { //设置默认视口大小
				width: 1920,
				height: 900
			},
			ignoreDefaultArgs:['--enable-automation'] //忽略默认参数: 启用浏览器由自动化控制的指示
		})

		const page = await browser.newPage()

		await page.goto('https://jd.com',{
			waitUntil: 'networkidle2' //满足networkidle2条件表示页面跳转完成(500ms内发送请求<2)
		})

		const key = await page.waitForSelector('#key') //输入框		
		await page.type('#key', '手机', {delay: 50})
    await key.focus()
		await page.keyboard.press('Enter')
		await page.keyboard.up('Enter')
		await page.waitForSelector('.gl-item')
		//滚动条操作
		let scrollEnable = true
		while(scrollEnable){
			scrollEnable = await page.evaluate(step => {
				let scrollTop = document.scrollingElement.scrollTop //html向上卷曲的高度
				document.scrollingElement.scrollTop = scrollTop+step; //每次滚动到的位置为步长+卷曲高度
				return document.body.clientHeight > scrollTop + 900 ? true: false
			}, 500)
			//延迟500ms执行一次
			await sleep(100)
		}		
		console.log('是否能继续滚动', scrollEnable)

		await page.waitForSelector('#footer-2017')

		const lis = await page.$$eval('.gl-item>.gl-i-wrap>.p-img>a', links => {
			return links.map(a => {
				return {
					href: a.href.trim(),
					title: a.title //a标签的标题 
				}
			})
		})
		await page.close()
    let obj = []
		const aTags = lis.splice(0,2)
		for(let [index,elem] of aTags.entries()){
			const page = await browser.newPage()
			await page.goto(elem.href, {waitUntil: 'networkidle2'})
			await page.waitForSelector('.sku-name')
			const name = await page.$eval('.sku-name', el => el.innerText)
			console.log(name)
			obj.push({
				title: name,
				href: elem.href
			})
			await page.close()
		}
		console.log(obj)
		await browser.close()
}

jd()