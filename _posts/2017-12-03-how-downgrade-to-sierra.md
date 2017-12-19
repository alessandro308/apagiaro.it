---
layout: post
title:  "How to download MacOS Sierra and downgrade to it"
date:   2017-12-2
excerpt: "Make your computer great again..."
tag:
- english
- problem
- MacOS
feature: https://cdn1.macworld.co.uk/cmsdata/features/3647580/macos_high_sierra_thumb800.jpg
comments: true
---

# Short Version
If you, as me, think that High Sierra introduces more bugs than useful feature and want to downgrade to Sierra, execute this commands on Terminal:

```
brew install mas
mas install 1127487414
```

After that, you have the Sierra image ready to be used to create your bootable device and you can perform your downgrade. Finally!

# Long Version
In the past, if you would download some previous OS that you already downloaded, you could simply donwload it from Mac App Store Purchased tab.
The problem appears after Sierra, when Apple said  "macOS Sierra or later doesn't appear in the Purchased tab" of Mac App Store ([here the document](https://support.apple.com/en-us/HT201272)) (thank you, Apple). So, I search some method to retrieve Sierra and reinstall it because High Sierra is very bad, why?

Try to see console log error...
I was developing a MacOS app and that, after update, has stopped working and this log appears in the log. And not just on my app...

![Month 13 is out of bound]({{ site.url }}/assets/img/post-image/month13.png)

Of course, this error (maybe a warning?) is not the only reason to downgrade, in my experience, the resume from stop state is slowly, and some other problems has appears (you can simply Google "High Sierra problems" to find a very long posts about them).

So, after downloaded the Sierra image (see upper paragraph), follow [this steps](https://www.imore.com/how-downgrade-macos) and enjoy your resurrected good Mac!

## Why don't downgrade
Of course, High Sierra, introduced some security improvement (also if recent problem, read [root access](https://www.macworld.co.uk/how-to/mac-software/how-stop-someone-getting-root-access-your-mac-3668317/) make think the opposite). Oh, I'm forgetting, in order to fix the root access, Apple has introduced [new bugs, yeah!!](http://mashable.com/2017/11/30/apple-security-fix-bug/). I've just downgraded.



