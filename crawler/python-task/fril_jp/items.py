# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class FrilJpItem(scrapy.Item):
    # define the fields for your item here like:
    utf8 = scrapy.Field()
    _method = scrapy.Field()
    authenticity_token = scrapy.Field()
    item_img_ids = scrapy.Field()
    updates = scrapy.Field()
    set_images = scrapy.Field()
    crop_x = scrapy.Field()
    crop_y = scrapy.Field()
    crop_size = scrapy.Field()
    item = scrapy.Field()
    pass

class InfoItem(scrapy.Item):
    user_id = scrapy.Field()
    name = scrapy.Field()
    detail = scrapy.Field()
    parent_category_id = scrapy.Field()
    category_id = scrapy.Field()
    size_id = scrapy.Field()
    brand_id = scrapy.Field()
    informal_brand_id = scrapy.Field()
    status = scrapy.Field()
    origin_price = scrapy.Field()
    sell_price = scrapy.Field()
    transaction_status = scrapy.Field()
    carriage = scrapy.Field()
    delivery_method = scrapy.Field()
    delivery_date = scrapy.Field()
    delivery_area = scrapy.Field()
    open_flag = scrapy.Field()
    sold_out_flag = scrapy.Field()
    related_size_group_ids = scrapy.Field()
    request_required = scrapy.Field()
    pass
    
