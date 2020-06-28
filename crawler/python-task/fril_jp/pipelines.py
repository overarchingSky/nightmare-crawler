# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

# JsonItemExporter会在整个数据生成完毕，并且调用finish_exporting时才会生成文件
# JsonLinesItemExporter会每次获取到数据，都实时写入文件内
from scrapy.exporters import JsonItemExporter,JsonLinesItemExporter,CsvItemExporter
# 使用自定义的csvItemExporter，其内部定义了csv表头的顺序和显示内容
from fril_jp.spiders.csv_item_exporter import MyProjectCsvItemExporter

# 导出为csv文件
class CSVFrilJpPipeline:
    def __init__(self):
        # wb 二进制方式打开
        self.fp = open("data-sheet/prod.csv","wb")
        self.exporter = MyProjectCsvItemExporter(self.fp, 'utf-8')
        self.exporter.start_exporting()

    def open_spider(self, spider):
        print(spider.cookies)
        print('商品爬虫开始了...')

    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item

    def close_spider(self,spider):
        self.exporter.finish_exporting()
        self.fp.close()

# 整个文件写入
class FrilJpPipeline:
    def __init__(self):
        # wb 二进制方式打开
        self.fp = open("data-sheet/prod.json","wb")
        self.exporter = JsonItemExporter(self.fp, ensure_ascii=False, encoding="utf-8")
        self.exporter.start_exporting()

    def open_spider(self, spider):
        print('商品爬虫开始了...')

    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item

    def close_spider(self,spider):
        self.exporter.finish_exporting()
        self.fp.close()


# 文件追加写入
# class FrilJpPipeline:
#     def __init__(self):
#         # wb 二进制方式打开
#         self.fp = open("data-sheet/prod.json","wb")
#         self.exporter = JsonLinesItemExporter(self.fp, ensure_ascii=False, encoding="utf-8")

#     def open_spider(self, spider):
#         print('商品爬虫开始了...')

#     def process_item(self, item, spider):
#         self.exporter.export_item(item)
#         return item

#     def close_spider(self,spider):
#         self.fp.close()