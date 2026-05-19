---
layout: post
title: "Your MCP Is a Frontend. Test It Like One."
date: 2026-05-19
excerpt: "Every company is building MCPs now. But treating them like just another API is a mistake — they are a new interface for a new kind of user, and they deserve proper validation."
tag:
- MCP
- testing
- AI
- agents
comments: true
---

Every company is writing their own MCP server now, and there's a good reason for that. MCP is the easiest way to allow new users to interact with an unknown system. Your customers no longer have to learn your UI, memorize your navigation, or read your documentation. Instead, your app adapts to their agents. It's a powerful shift, and it's happening fast.

But here's the thing that most teams get wrong: MCP may look like just another API to expose, but in reality it's another frontend. It's a new interface that needs to be validated for its users, just as your UI is validated with UX tests.

### The users of your MCP are the agents

When you build a web UI, you test it with real users. You run usability tests, you measure if people can complete tasks, you iterate on labels and layouts. The same discipline should apply to your MCP, except the users are not humans — they are agents. And without proper validation, you're just deploying a proof of concept.

Any production-grade software needs proper UX alongside e2e, integration and unit tests. But MCP plays in a different tournament. It runs in a non-deterministic environment. The agent decides which tool to call, how to interpret the description, and what parameters to pass. On top of standard tests, you also have to validate that this non-deterministic environment returns what you expect.

### How we test MCP at Domotz

For that reason, at **[Domotz](https://www.domotz.com)** we are running evaluation tests using different models to make sure that the descriptions, tool names and parameters of our MCP can be used by its users — the agents — to solve effective problems for our users — the human customers.

There are several tools that allow you to do this, like **[Promptfoo](https://www.promptfoo.dev/)** or **[Langfuse](https://langfuse.com/)**. You can choose whatever fits your stack. The idea is always the same: you define several use cases and check that your MCP tools are called from different LLMs as you expect. The data are mocked, but the interactions with the LLMs are real.

### Why your Claude Code session is not a test environment

If you test your MCP using your Claude Code instance, your tests are ineffective. Think about it: Claude Code runs on your computer where you probably also set up a `CLAUDE.md` file. You have memories about your coding projects, you have your repos checked out that tell Claude Code about your business domain, and you may have MCP servers configured that give it extra context. Claude Code is optimised to help *you*, the developer — not to simulate a fresh agent encountering your tools for the first time.

For that reason, in Promptfoo we run against pure model APIs, simulating the agent loop manually on each API response. No `CLAUDE.md`, no memories, no local repos. Just the model, your MCP tool definitions, and a use case to solve. This is the only way to know if your descriptions, names and parameter schemas actually work for an agent that has never seen your system before.

### Stop guessing, start measuring

This approach allows us to use a systematic method to optimize our MCP to work with the favourite models of our users. It lets us stop the guessing that we are all prone to: *"I think this description should mention network monitoring..."*, *"I think this parameter name is clear enough..."*.

Do you think that? Ok, let's try it. Write the description, run the eval, check the results. If the agent picks the right tool and passes the right parameters across Claude, GPT and Gemini, you're probably on the right track. If it doesn't, you have data to iterate on — not opinions.

MCP is a new interface for a new kind of user. Treat it with the same rigor you'd apply to any frontend.
