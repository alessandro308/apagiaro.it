---
layout: post
title: "Can You Still Explain What the Agent Did?"
date: 2026-07-23
excerpt: "The dangerous part of AI coding is not that the agent fails. It's that it succeeds, and you quietly stop understanding the work. The best workflows optimize for whether you can still own the system afterwards."
tag:
- AI
- agents
- coding
- workflow
comments: true
---

{% include prose/lede.html eyebrow="On agentic engineering" text="The dangerous part of AI coding is not that the agent <span class='prose-lede__machine'>fails</span>. It's that it <span class='prose-lede__human'>succeeds</span> &mdash; and you stop understanding the work." %}

We spend a lot of time worrying about coding agents making mistakes. Wrong fix, hallucinated API, a test that passes for the wrong reason. That's the failure mode everyone talks about, and it's the least dangerous one, because when an agent fails you notice. The build breaks, the test goes red, you go and look.

The real risk is the other one: the change ships, the tests are green, the PR looks clean. And somewhere along the way the agent explored files, weighed a few approaches, rejected some, changed an assumption, and fixed a problem you never actually saw. You approve it because it works. Six weeks later it breaks in production at 3am, and now it's your name on the blame and a piece of code you can't reconstruct in your head.

{% include prose/split.html left_label="The agent" left="Explores files, weighs approaches, rejects some, changes assumptions, fixes problems you never saw." right_label="You" right="Wait for the summary at the end &mdash; by which point you're already behind, nodding at work you can't reconstruct." divider="drift" %}

### Summaries at the end arrive too late

The normal pattern is: give the agent a task, let it work, ask for a summary at the end. But by then you're already behind. The summary is a snapshot of decisions that were already made without you. The reasoning has been compressed away, the branches it discarded are invisible, and the trade-offs are gone.

Worse, a written summary lets you fool yourself. You skim it, it sounds reasonable, you nod along and convince yourself you understood it. Convincing yourself you understand is more dangerous than knowing you don't, because it stops you from asking the next question.

### Keep the human in the loop *while* the work happens

A guy from Anthropic [suggested a prompt](https://x.com/trq212/status/2061545633560010826?lang=en) that I really like, and it reframes the whole thing. It's not about getting the model to write more code. It's about making sure the human stays in the loop *while* the agent is working, not after.

Instead of a report at the finish line, you ask the agent to actively track what you should understand as the work unfolds:

{% include prose/steps.html items="What problem did we find?|Often not the one written in the ticket.;;Why was it happening?|The root cause it traced and you never walked.;;What options did we consider,|and which did we throw away?;;What did we choose,|and what trade-off did that lock in?" %}

And then the important part: it asks *you* to explain your understanding back.

{% include prose/callout.html label="The move" text="Now the agent isn't just producing an answer &mdash; it's checking whether the knowledge actually transferred. The suggestion even pairs it with voice mode, which makes a lot of sense: you can skim a written summary and pretend you got it, but the moment you have to say it back out loud, the thin spots become obvious in seconds." %}

The full prompt is worth reading in its original form, the exact wording matters here: [gist.github.com/ThariqS](https://gist.github.com/ThariqS/1389dcdff9eba4789887a2211370f06b).

### Shipping is one part of the job

This is the part that gets lost in the excitement about how much an agent can complete. In professional software engineering, shipping the change is where responsibility *starts*, not where it ends. Every one of these depends on your comprehension surviving the handoff:

{% include prose/grid.html items="Review|You have to judge the change, not rubber-stamp it.;;Debug|You have to fix it at 3am, when it breaks.;;Explain|You have to hand it to the next person.;;Own|You're accountable when it fails in production." %}

An agent that finishes twice as fast but leaves you unable to reason about the result hasn't made you faster, it's just moved the cost to the worst possible moment.

### The better question

So the real question about a coding agent is not *"did it finish the task?"*. It's:

> Can I explain what the agent did well enough to own the result?

I think this is going to become a much bigger pattern in how we work with agents. The best workflows won't optimize for how much the agent can complete. They'll optimize for whether the engineer can still own the system afterwards. The code is cheap now, understanding is the scarce thing, and the workflows that protect it are the ones worth building.
