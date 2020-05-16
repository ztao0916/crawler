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

async function lang(){
    try {
        //创建一个浏览器对象
        const browser = await puppeteer.launch({
          executablePath: 'C:\\nvm\\v10.16.0\\node_modules\\puppeteer\\.local-chromium\\win64-722234\\chrome-win\\chrome.exe',
          defaultViewport: { //设置默认视口大小
            width: 1920,
            height: 900
          },
          headless: false,
          slowMo: 50, //将操作时间设为200ms
          ignoreDefaultArgs:['--enable-automation'] //忽略默认参数: 启用浏览器由自动化控制的指示
        })

        const page = await browser.newPage()
        await page.goto('https://m.zhangyue.com/readbook/11859876/4.html')

        await page.click('div.tips_menu')
        //滚动条操作
        let scrollEnable = true
        while(scrollEnable){
          scrollEnable = await page.evaluate(step => {
            let scrollTop = document.scrollingElement.scrollTop //html向上卷曲的高度
            document.scrollingElement.scrollTop = scrollTop+step; //每次滚动到的位置为步长+卷曲高度
            return 323966 > scrollTop + 900 ? true: false
          }, 500)
          //延迟500ms执行一次
          await sleep(100)
        }

        await page.screenshot({path:'langshu.png', fullPage: true,clip:{
          x:0,
          y:0,
          width:1920,
          height:323966
        }})

        // await browser.close()
    }catch(e){
      console.log(e)
    }
}

lang()