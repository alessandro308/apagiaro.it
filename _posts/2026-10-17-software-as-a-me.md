---
layout: post
title: "Software as a Me. And Why We Still Need Engineers."
date: 2026-10-17
excerpt: "AI made it trivial to build software that fits exactly one person. That's magic at home and dangerous at work, and that gap is exactly where the software engineer is needed more than ever."
tag:
- AI
- agents
- coding
- career
comments: true
---

{% include prose/lede.html eyebrow="Random thoughts on this moment" text="It has never been easier to <span class='prose-lede__machine'>build</span> software. It has never mattered more to know <span class='prose-lede__human'>what</span> to build." %}

A lot of developers are disoriented right now. Every week there's a new model, a new agent, a new demo of something that used to take a team a quarter and now takes an afternoon. Some people are excited, some are scared, most are a confusing mix of both.

This post is not a guide or a list of patterns. It's just what I've been thinking about lately, because I'm in the middle of it too.

### A magical time, if you love finishing things

If you love building things and seeing them reach the end, this is a magical moment. The distance between *"it would be cool if…"* and *"it works"* has collapsed. Ideas that used to die in a notes app now ship.

It's a less magical moment if what you loved was the obscure debugging. The hours spent chasing a weird bug through three layers of abstraction, the satisfaction of finding the one-line fix nobody else could find. That craft is not gone, but it matters less every month.

What matters more now is deciding *what* to do, not doing it. Choosing the problem, framing it, knowing when the result is good enough. The typing part is cheap.

And I'll be honest: I find myself in a kind of limbo. Some days it feels like the technical skills I spent years building are almost useless. That's not a comfortable feeling, and I don't think I'm the only one having it.

### Welcome to Software as a Me

Here's what changed in practice. At home, I used to finish a side project every two or three months. Now I can do one a week.

I rebuilt my Android launcher, exactly the way I want it. I set up **[Home Assistant](https://www.home-assistant.io/)** without spending months reading docs and forums. I just described the problem I had and how I thought I would solve it, and let the AI pick the tools and the configuration. The result is a setup far more advanced than anything I would have imagined building on my own.

This is what I call **Software as a Me**. Not software built for a market, built for a user of one. Everyone can now build their own piece that does exactly what they need, no more and no less. No compromises to fit a thousand other users, no features you'll never touch, no waiting for a roadmap.

It's a real shift, and I think we're only at the beginning of it.

### Where it breaks

But all of this breaks the moment you take it to a professional level. You can't sell Software as a Me. Your customers don't need something that fits *you*, they need a solution that is robust, secure and scales.

{% include prose/grid.html items="Robust|It has to keep working when you're not looking.;;Secure|It holds customer data, not your playlists.;;Scalable|It serves thousands of users, not one.;;Owned|Someone has to understand it when it breaks." %}

And the stakes are completely different.

{% include prose/split.html left_label="At home" left="The media server is down for a day? Who cares. I don't read every line, I let the agent take minor architectural decisions, and I fix things when they break." right_label="At work" right="Downtime costs customers. Every line is something you'll have to review, debug, explain and own. Delegating decisions you don't understand is not an option." divider="stakes" %}

At home, I can afford not to read everything. I can delegate the small architectural choices, because the worst case is a broken weekend. At work, this is simply not acceptable.

The risk is not that the agent writes bad code. The risk is that it writes code that works, and you end up with serious security problems and huge issues to solve on a system you have no context on. I wrote about this in my [previous post](https://apagiaro.it/can-you-still-explain-what-the-agent-did/): when the agent succeeds and you stop understanding the work, the bill arrives later, at the worst possible moment.

That's where I see my value as a developer today. Not in writing the code, but in making sure the code that ships is something we can stand behind.

### I'm not against code written by AI

Let me be clear on this, because it's easy to misread. I'm not against code fully written by AI. AI already writes code better than me. What I'm against is code that was never reviewed by skilled people, people who can drive the AI, question it, and push it to produce the best result.

Left alone, an agent tends to solve problems *locally*. It fixes the bug in front of it, patches the endpoint it was asked about, adds a check in the one place that failed. Every single fix can be correct, and the system as a whole can still be fragile. The job of the engineer is to step back and architect the code so that entire classes of problems can't happen in the first place.

{% include prose/split.html left_label="Fixed locally" left="Every new endpoint remembers to check authentication. Every HTTP call builds its auth headers by hand. Until one day one of them doesn't." right_label="Removed by design" right="The framework makes it impossible to write an endpoint without authentication. Requests with custom authentication simply can't be made. The bug has nowhere to live." divider="altitude" %}

Choosing a framework that makes the wrong thing impossible is what gives you robust software, even when every line of it is written by AI. And here's the catch: to ask the AI for that, you need to know how to code. You need to know what a class of bugs looks like before you can ask for it to be designed away.

So no, my technical skills are not useless. They just moved up a level.

### The engineer who asks questions

So yes, we will still need good developers. But maybe not the same kind we were hiring five years ago.

{% include prose/callout.html tone="human" label="The engineer we need" text="The one who asks you questions to understand the problem. The one who cares about the problem before the solution. The one who helps you find the <em>real</em> problem, which is often not the one you walked in with." %}

Agents are great at producing solutions. They are much worse at telling you that you're solving the wrong problem. They take your prompt for granted. A good engineer doesn't, and starts from questions like these:

{% include prose/steps.html items="What problem are we actually solving?|Often not the one in the request.;;Who has this problem?|And what do they do today without our solution?;;What happens if we get it wrong?|Downtime, a data leak, or just a broken weekend?;;Is this worth building at all?|Sometimes the best code is the one you don't write." %}

Knowing which question to ask, which trade-off is acceptable, which shortcut will come back to bite you in six months: this is the job now. It always was, really. We just had a lot of typing in the way.

The software engineer is not dead. The software engineer is more alive than ever.
