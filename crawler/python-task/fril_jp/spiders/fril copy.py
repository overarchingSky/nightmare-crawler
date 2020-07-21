# -*- coding: utf-8 -*-
import scrapy
from fril_jp.items import FrilJpItem
from scrapy import Request
import re

class FrilSpider(scrapy.Spider):
    name = 'fril'
    allowed_domains = ['fril.jp']
    # start_urls = ['http://fril.jp/']
    # start_urls = ['https://fril.jp/category/668?min=300&max=300000']
    # start_urls = ['https://fril.jp/sell']
    # 通过抓取第一个地址（页面）拿到csrf-token，以备给第二个url（接口）使用
    start_urls = ['https://fril.jp/sell']#page=2
    detail_urls = ['https://fril.jp/ajax/item/selling']
    isStartUrl = False
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "x-csrf-token":"",
        "x-requested-with":"XMLHttpRequest",
        #"cookie":""
    }

    formModel = {
        "item": {
            "id": '',
            "user_id": '',
            "name": "",
            "detail": "",
            "parent_category_id": 1135,
            "category_id": 1143,
            "size_id": 19999,
            "brand_id": None,
            "informal_brand_id": None,
            "status": 5,
            "origin_price": 2810,
            "sell_price": 2810,
            "transaction_status": 0,
            "carriage": 1,
            "delivery_method": 9,
            "delivery_date": 1,
            "delivery_area": 23,
            "open_flag": 1,
            "sold_out_flag": 0,
            # "category_name": "車内アクセサリ",
            # "size_name": "なし",
            # "brand_name": "指定なし",
            # "delivery_method_name": "未定",
            "related_size_group_ids": [],
            "request_required": "0"
        }
    }

    def __init__(self,cookies=None,*args, **kwargs):
        print('cookies spider')
        print(cookies)
        self.cookies = {
            "_ra":"1593332952428|23099db8-3a17-470e-9a72-8bce3dd5e074",
            "__gads":"ID=70088d27be40d614:T=1593332953:S=ALNI_MbuN15fTWskyScpKIMBl5V94LiUsw",
            "_gid":"GA1.2.1018829010.1594605295",
            "_ga":"GA1.2.1999933104.1593332952",
            "_fbp":"fb.1.1594610025071.236646165",
            "JSESSIONID":"2c5ddb034e00e2a6",
            "NID":"204=zoxHej7vvySBKSOaBbYzWHeF0MjEfk5z90UNyl1bpuUAL10JHONMF_tEglDQ3Rwha0ApxIWiRBXBD6fjPT7YfRhQjpsmhnaCwdxpiAxypWfA715JupqVVDD8c5WDMYZvTWWC5kktTRIcpFDBD0Vre9P2Y2r8X4ufrxQ5fHfTwII",
            "DSID":"NO_DATA",
            "IDE":"AHWqTUn0dHxngSo96a4j9xj_RwkQkaOnznudk5hJ6lwPh-aMpQ9m7iMGDu9m_bFv",
            "ak_bmsc":"742322F28227E73AC5CFF9DEE55AAA8B17C3584DFF29000072000C5F91D77F03~plSmKRUJ/pE30IUBfJ3oRHAu8mbBNY5HmrKy90YVj2NjhSZdGixUqPJ3Wo34JP7OYe1ScPfz0H/XPfRWQMdeR6j2jbB2GhWWN31pIOygVCaA4pGxUqci5W8ihI2oaUqxlZq+9V8oqkVnFw81Ji8e4Gr340hn7Z1BYLJZEqnhl7d1VwmV+HSjKUfTOkieAw9QNBrJBJDxwxpI+iLjwqkzlC47lyUc6t1NuowmAyECtxwp7O7RCEaL7VOiFB7L1TL/yh",
            "Rp":"202cee951c16ed6371bece5f175ef854dbd6e6d",
            "_fril_user_session_id":"4afc2b11d4c605b40a969d51be29d450",
            "fr":"0UsGVfQvQrcwwhv76..Be-FTZ...1.0.BfC77x.",
            "tfw_exp":"0",
            "Apache":"1c3d7bb7.5a920bcf306a4"
        }#cookies
        super(FrilSpider, self).__init__(*args, **kwargs)

    def start_requests(self):
        print('start_requests')
        yield Request(self.start_urls[0], callback=self.parsePage, cookies=self.cookies,
                      headers=self.headers)

    def parsePage(self,response):
        print('parse-page')
        csrfToken = response.xpath(".//meta[@name='csrf-token']/@content").get()
        self.headers['x-csrf-token'] = csrfToken
        print('headers',self.headers)
        yield Request(self.detail_urls[0], callback=self.parseProd, 
        #cookies=self.cookies,
                      headers=self.headers)
    
    def parseProd(self, response):
        print('parseProd')
        print(response)
        aprods = response.body.split(');')
        print(aprods)
        # prods = [item for item in aprods if item.startswith("$('#selling-container').append")]
        # # prods = response.xpath("./div")
        # print('prods')
        # print(prods)
        # for prodSelector in prods:
        #     arr = prodSelector.xpath(".//a/@href").get().strip().replace('\\"','').split('/')
        #     detailUrl = 'https://fril.jp/' + arr[-1]

        #     print('detailUrl')
        #     # print(prodSelector.xpath(".//a/@href").getall())
        #     print(detailUrl)
        #     yield Request(detailUrl, callback=self.parseDetail,headers=self.headers)

    def parseDetail(self, response):
        print('parseDetail:')
        # responseBody = response.body
        # print(responseBody)
        # pattern = re.compile(r"{[\S\s]*}")
        # detail = pattern.findall(responseBody)
        # detail = response.xpath(".//form[@id='item-form']/div[last()]/@data-react-class").body
        detail = response.xpath('.//form[@id="item-form"]/div[last()]').get()
        print(type(detail))
        yield detail
