# ui

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### developmen
```
cnpm i
npm run serve
npm run start
```


使用 scrapy-splash 渲染动态网页
pip install scrapy-splash
使用docker 运行 scrapy-splash实例



# 抓包调试
cnpm i -g anyproxy
chrome安装chrome代理插件，然后配置到127.0.0.1 8001端口，并启动，完成浏览器客户端代理，以便被anyproxy正确抓包
然后启动代理
anyproxy -i --rule any-proxy/rules.js

原理：rules.js内配置了二级代理，代理到了本机翻墙工具代理的端口，从而实现了如下流程：
客户端请求->一级代理（anyproxy）->二级代理（翻墙工具）-> 目标服务器

根据原理可知，务必保证rules.js内的代理端口和翻墙工具的代理端口一致