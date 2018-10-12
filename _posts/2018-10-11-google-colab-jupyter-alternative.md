---
layout: post
title: "A cloud alternative to Jupyter from Google"
date: 2018-10-11
excerpt: "Jupyter is a notebook to write and execute code in the same page. Google have created a tool that is like Jupyter but easily to use"
tag:
 - python
 - google
 - Jupyter
comments: true
feature: /assets/img/post-image/colab.png
showFeature: false
---
In our course of Data Mining, at University of Pisa, the teacher use Jupyter. Jupyter is a notebook where you can write some code, execute it and then see the output directly below the code, in the same page. It is a very powerful tool that speed up the coding phase and helps people that are not familiar with the terminal to code in a "familiar" space.
![Google Colab](/assets/img/post-image/colab-screen.png)

The main problem is that Jupyter is complex to configure, to change from Python 2.7 to 3 you have to install packets, do stuff with the terminal, download bytes on your disk and so on... Moreover, if you would like to share the notebook with your colleague you have to do some special trick: install jupyter on your server, activate multiuser mode, invest hours of your time because it will not works...

But there is a solution: [Google CoLab](https://colab.research.google.com/)

It is like a Jupyter, more minimal but has:
 1. Python 2.7 and 3 both ready to use
 2. You can share it like any other Google Docs file, simply generating a link and send it
 3. It is in the cloud, you can use it anywhere
 4. It support hardware acceleration
 5. It can execute python on your machine or on hosted one
 6. It can access to your Google Drive account with few line of code

## Python 2.7 or 3
You can simply change the runtime type selecting "Runtime" from the main menu, then "Change runtime type". No other installation are required!
![Google Colab](/assets/img/post-image/colab-runtime.png)

## Share the notebook
You should be familiar with this feature
![Google Colab](/assets/img/post-image/colab-share.png)

## Execute on your machine
Here some more configuration have to be done. If you would like to execute code on your machine you have to install Jupyter, then have to activate the `jupyter_http_over_ws` jupyter extension then start the server. [https://research.google.com/colaboratory/local-runtimes.html](More info).
![Google Colab](/assets/img/post-image/colab-host.png)

## Access to file
In order to access to some files you can:

 - Connect to Google Drive

```python
from google.colab import drive
drive.mount('/content/drive')
```

 - Upload files on the temporary local drive
 - Download the file from a Gist

```python
import requests
url="https://gist.githubusercontent.com/..../file.txt"
s=requests.get(url).content
df=pd.read_csv(io.StringIO(s.decode('utf-8')))
```

![Google Colab](/assets/img/post-image/colab-file.png)

### [Try it!](https://colab.research.google.com/)