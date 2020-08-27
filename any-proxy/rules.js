const httpProxyAgent = require('http-proxy-agent');
const httpsProxyAgent = require('https-proxy-agent');
module.exports = { 
    *beforeSendRequest(requestDetail) {
        const newRequestOptions = requestDetail.requestOptions;
        var agent = null;
        if(requestDetail.protocol == 'http') {
            agent = new httpProxyAgent("http://127.0.0.1:10807"); //10807是翻墙工具代理的端口，这里请保持一致
        } else {
            agent = new httpsProxyAgent("http://127.0.0.1:10807");//10807是翻墙工具代理的端口，这里请保持一致
        }
        newRequestOptions.agent = agent;
        return {
          requestOptions: newRequestOptions
        };
    },
    *beforeDealHttpsRequest(requestDetail) {
      return true;
    }
};