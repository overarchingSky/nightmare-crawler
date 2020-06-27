# -*- coding: utf-8 -*-
import scrapy
from fril_jp.items import FrilJpItem

class FrilSpider(scrapy.Spider):
    name = 'fril'
    allowed_domains = ['fril.jp']
    # start_urls = ['http://fril.jp/']
    start_urls = ['https://fril.jp/category/668?min=300&max=300000']

    def parse(self, response):
        prods = response.xpath("//div[@class='content']/section[@class='view view_grid']/div[@class='item']")
        for prodSelector in prods:
            name = prodSelector.xpath(".//p[@class='item-box__item-name']/a/span[@itemprop='name']/text()").get().strip()
            print(name)
            a = prodSelector.xpath(".//div[@class='item-box__image-wrapper']/a")
            url = a.xpath("@href").get().strip()
            print(url)
            desc = a.xpath("@title").get().strip()
            print(desc)
            img = a.xpath(".//img/@src").get().strip()
            print(img)
            item = FrilJpItem(name=name, url=url, img=img, desc=desc)
            yield item
        
        # view view_grid
        # print('++++ content:')
        # print(content)
        pass
