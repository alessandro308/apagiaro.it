---
layout: post
title:  "A useful Telegram feature to implement: a subchat"
date:   2017-12-25
excerpt: "A new feature that can be useful to organize events"
tag:
- english
- telegram
- idea
feature: http://www.anconanord.it/images/stories/telegram.jpg
comments: true
---
If I open my Telegram client, I see 300 contacts, 50 groups. With so many chats it so easy to organize something, just open the chat with some friend and start to coordinate, right? No! The problem is that in the chat you talk about thousands topics in the same time and it is so difficult to not lose some information. The solution? Slip topics into different chat.

So I have a fantastic brainwave! Why not create a **Telegram Sub-chats** (visualized as chat tab)? 

![Telegram Tabs]({{ site.url }}/assets/img/post-image/telegram.png)

## How to implements tabs
Of course, the right way to implement this feature is to extend the [main protocol](https://core.telegram.org/mtproto), but this implies to edit the telegram code on the server side that is not open source. So, my solution is to manage the tabs like a groups. 

When you click on *New Tab*, the client will ask you a name, than will create, with the standard API, a new group that is called with a special name: `TAB-<contactName>-<tabName>` (e.g. *TAB-alessandro-newyearparty*). 

So, when the client finds a group called like `TAB....` then shows this group as tab under the contact according to the group name second part. 

What do you think about? Do you find some critical aspect that I've not evaluated? I'm searching for someone to try to implement this feature on a client with me (Android or QT Desktop client).