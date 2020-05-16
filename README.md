# 一 puppeteer基础

      注意: 安装报错,修改路径下载浏览器的路径为: npm config set puppeteer_download_host=https://npm.taobao.org/mirrors

1. 调用puppeteer的浏览器API, browser = puppeteer.launch() 	[浏览器实例 Browser 对象]
2. 通过puppeteer的浏览器API打开新的窗口 page = browser.newPage()	[通过 Browser 对象创建页面 Page 对象]
3. 在新窗口中跳转到新地址 page.goto(https://baidu.com) [page.goto() 跳转到指定的页面]
4. 对访问的网址进行截屏,同时设置保存路径和文件名 page.screenshot({path:'baidu.png'}) [page.screenshot() 对页面进行截图]

# 二 京东样例

Puppeteer 的实现流程：

1. 打开京东首页
2. 将光标 focus 到搜索输入框
3. 键盘点击输入文字
4. 点击搜索按钮

已实现demo

入门级别的爬虫对于有工作经验的人来说应该是信手拈来的。而爬虫困难的点在于，目标网站的各种封禁，爬虫和反爬虫之间的较量，甚至是大数据量级别的爬取，机器的负载，代理IP池的考虑等等。

安装跳过chrome(配置executablePath)

	npm install puppeteer --ignore-scripts

	全局路径: C:\\nvm\\v10.16.0\\node_modules\\puppeteer\\.local-chromium\\win64-722234\\chrome-win\\chrome.exe