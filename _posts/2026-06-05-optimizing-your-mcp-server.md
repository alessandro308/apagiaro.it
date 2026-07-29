---
layout: post
title: "Your MCP Has Too Many Tools. Here's How to Fix It."
date: 2026-06-05
excerpt: "MCP servers are powerful, but context bloating is real. Here are three patterns to keep your tool surface lean without losing functionality."
tag:
- MCP
- AI
- optimization
comments: true
---

{% include prose/callout.html tone="human" label="Heads up" text="The MCP protocol was updated on 28 July 2026. Some of the details below &mdash; especially around tool discovery and visibility APIs &mdash; may no longer be accurate. Check the current spec before relying on them." %}

The AI community has already noticed: CLI-based tool calling tends to be more token-efficient than MCP. And yet, there are scenarios where MCP is clearly the better fit. If you need remote business logic, if you want control over incoming requests, if you're running proprietary code, or if you're exposing tools to clients that simply cannot execute local commands — MCP is the way to go.

But there's a problem that grows with your server: **context bloating**.

Every tool you register in your MCP server gets serialized into the system prompt. Tool names, descriptions, parameter schemas — all of it lands in the context window before the agent even starts thinking. When you have 10 tools, this is fine. When you have 50 or 80, you're burning tokens just to describe what the agent *could* do, and the model has to parse through all of it to decide what to actually call. Worse, a crowded tool list leads to worse tool selection accuracy. The agent gets confused, picks the wrong tool, or hallucinates parameters.

This is not a theoretical concern. If you're building a production MCP server with real domain coverage, you will hit this wall.

Here are three patterns to deal with it.

### 1. Reduce and group your tools

The most straightforward approach: merge related tools into fewer, broader functions. Instead of exposing `list_open_issues`, `list_closed_issues`, `list_in_progress_issues` as separate tools, you expose a single `list_issues` tool with a `status` parameter.

This works, but it's a double-edged sword. Fewer tools means less noise in the context window, but each tool becomes more complex. Its description gets longer, its parameter schema gets richer, and the agent has to understand more nuance to call it correctly. In my experience, smaller models struggle more with these "Swiss army knife" tools than with a clean set of focused ones. You're trading breadth for depth, and the net effect on LLM effectiveness depends heavily on your use case and the models your users run.

Still, it's the first thing to try. Audit your tool list and ask: are there tools that are always called together, or tools that differ only in one parameter? Those are candidates for merging.

### 2. Embedding search pattern

A more radical approach: don't expose your tools at all. Instead, expose just two meta-tools — `search` and `execute`. The agent first searches for what it needs using natural language, gets back the relevant tool definitions, and then calls them.

This pattern has already been implemented by a few projects. **[NCP](https://github.com/portel-dev/ncp)** is an open-source tool that acts as an intermediary layer, indexing your MCP tools with embeddings and exposing a search-first interface to the agent. On the framework side, **[FastMCP's tool search transform](https://gofastmcp.com/servers/transforms/tool-search)** provides a similar capability built into the server itself, letting you wrap any existing MCP server with an embedding-based discovery layer.

The advantage is clear: your context window stays lean regardless of how many tools you have. The downside is that you add a round-trip — the agent has to search before it can act — and the quality of the search index matters. If the embedding doesn't surface the right tool, the agent is stuck.

### 3. Progressive tool disclosure

This is the pattern I find most interesting, and the one the MCP protocol itself is starting to support natively.

The idea: start the session with a small set of core tools visible, and progressively unlock more tools as the conversation evolves. When the agent calls `search_customers`, the order-related tools become available. When it calls `list_invoices`, the billing tools appear. The agent discovers what it needs through its own actions.

In **[FastMCP](https://gofastmcp.com/)**, this is supported through the component visibility API. You can tag your tools at registration time and then control visibility at the session level:

```python
from fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool(tags={"domain:orders"})
async def get_order_details(order_id: int) -> str:
    ...

@mcp.tool(tags={"domain:billing"})
async def issue_refund(invoice_id: int) -> str:
    ...

# Hide these domains by default
mcp.disable(tags={"domain:orders", "domain:billing"})
```

Then, when a trigger tool is called, you unlock the relevant domain using the session context:

```python
@mcp.tool()
async def search_customers(query: str, ctx: Context) -> str:
    # Unlock order tools for this session
    await ctx.enable_components(tags={"domain:orders"}, components={"tool"})
    ...
```

When `enable_components` is called, FastMCP automatically sends a `ToolListChangedNotification` to the client, and the agent sees the newly available tools in its next turn. This is session-scoped — other sessions are not affected.

You can also add an explicit `discover_tools` tool that lets the agent unlock domains on demand, which is useful for tools that have no natural trigger in the core set.

The beauty of this pattern is that it mirrors how humans explore complex systems. You don't show someone every menu option on their first visit — you let them navigate to the area they need, and reveal depth progressively. The same logic applies to agents.

### Which pattern should you use?

It depends on your scale and your users. If you have fewer than 20 tools, grouping might be all you need. If you have a large, flat tool surface with many unrelated domains, embedding search gives you the most compression. If your tools have natural hierarchies and workflows — where one action logically leads to another — progressive disclosure fits like a glove.

In practice, you can combine them. Group where it makes sense, use progressive disclosure for domain separation, and keep embedding search as a fallback for edge cases.

The key takeaway is the same one from my [previous post about MCP testing](https://apagiaro.it/mcp-is-a-frontend-test-it-like-one/): your MCP is not just an API. It's an interface for agents. And like any interface, it needs to be designed for its users. Throwing 80 tools at an agent and hoping for the best is the MCP equivalent of a settings page with 200 checkboxes. It technically works, but nobody will use it well.

Optimize your tool surface. Your agents — and your token bill — will thank you.
