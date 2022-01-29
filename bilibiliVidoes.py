# -*- codeing = utf-8 -*-
# @Time: 2022/1/29 18:56
# @Author: Coisini
# @File: bilibiliVidoes.py
# @Software: PyCharm


import sys
import you_get

def download(url, path):
    sys.argv = ['you-get', '-o', path, url]
    you_get.main()

if __name__ == '__main__':
    # 视频网站的地址
    url = '要下载的视频网址'
    # 视频输出的位置
    path = 'E:\\bilibilivideos'
    download(url, path)