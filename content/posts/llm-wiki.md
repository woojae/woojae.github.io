+++
title = 'The LLM Wiki and My Pomodoro Logs'
date = 2026-05-01T10:00:00+09:00
draft = false
+++

Andrej Karpathy recently published a [gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) describing something he calls the "LLM Wiki" — a pattern for building a personal knowledge base that compounds over time. It's one of those ideas that feels obvious in hindsight but nobody had written down cleanly until now.

The core idea: stop treating LLMs as stateless question-answering machines. Instead, use them to maintain a persistent, structured wiki that grows every time you feed it new information. Knowledge accumulates through incremental updates rather than being re-derived from scratch every conversation.

## The Three Layers

Karpathy's architecture has three layers:

**Raw Sources** — your immutable inputs. Articles, PDFs, notes, logs. Anything you want the system to know about.

**The Wiki** — LLM-generated markdown pages organized by entities, concepts, and syntheses. The LLM maintains cross-references, resolves contradictions, and keeps summaries current. A single new document might touch 10-15 wiki pages.

**The Schema** — configuration files (like a `CLAUDE.md`) that tell the LLM how to structure the wiki, what conventions to follow, and how to handle different types of input.

The key insight is that the tedious maintenance work — updating links, keeping summaries fresh, flagging contradictions — is exactly the kind of work LLMs are good at and humans hate doing. Humans curate sources and ask good questions. LLMs handle the bookkeeping.

## Where My Pomodoro Logs Fit In

When I read this, I immediately thought of my [Pomodoro timer](/posts/pomodoro/). Every day, it generates a markdown file with every work session I completed — what I worked on, notes I took during the session, and a brief reflection afterward. They pile up in `~/pomodoro/`, one file per day:

```
~/pomodoro/
├── 2026-04-28.md
├── 2026-04-29.md
├── 2026-04-30.md
└── 2026-05-01.md
```

I already use a shell helper to search and review these logs. But they're raw data. I look at them when I need to remember what I did yesterday or find when I last touched a project. That's useful, but it's not compounding.

In Karpathy's framework, these daily logs are the perfect **raw source layer**. They're structured, timestamped, and they capture what I'm actually spending my time on — not what I think I'm spending my time on. That distinction matters.

## Weekly Summaries That Actually Mean Something

The immediate application is weekly summaries. Right now, when someone asks me what I worked on last week, I scroll through five markdown files and try to reconstruct a narrative. It's fine, but it's manual and I lose the patterns.

An LLM wiki would ingest those five daily logs and produce something like:

- A **weekly summary page** with time allocation across projects
- Updated **project pages** with recent progress and open threads
- **Pattern detection** — "you spent 60% of your time on auth refactoring this week, up from 20% last week"
- **Carry-forward items** — sessions where the reflection mentions unfinished work that never got picked back up

The daily logs stay immutable. The wiki pages get rewritten every week. Over months, you'd have a genuine record of where your time went and what you actually accomplished — not a todo list of intentions, but a log of reality.

## The Boring Part Is the Valuable Part

What I like about this pattern is that it takes the most tedious part of personal productivity — reviewing, summarizing, and connecting your own work — and hands it to something that doesn't mind doing it. I'm never going to sit down on a Friday afternoon and cross-reference my pomodoro sessions to figure out which projects are silently eating all my time. An LLM will.

The pomodoro logs are already there. They're already structured. They're already markdown. It's almost like I accidentally built the raw source layer for an LLM wiki without knowing it.

Now I just need to build the other two layers.
