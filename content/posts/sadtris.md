+++
title = 'Sadtris'
date = 2026-02-25T12:00:00+09:00
draft = false
+++

You're on a plane. No Wi-Fi. You want to play Tetris. You open the App Store — oh wait, you can't. Even if you could, every Tetris app wants a subscription for a game that was designed in 1984.

So I built [Sadtris](https://github.com/woojae/sadtris). A native macOS Tetris clone. One Swift file. Zero dependencies. No internet required. Just blocks falling down a screen while you sit in seat 34B wondering where it all went wrong.

## What It Is

The whole game is a single file: `SadtrisApp.swift`. SwiftUI `Canvas` for rendering. `NSViewRepresentable` for keyboard input. `UserDefaults` for a leaderboard nobody else will ever see. It has the mechanics competitive players expect — hold piece, ghost piece, lock delay, DAS/ARR, wall kicks, T-spin detection — which is overkill for something you'll play alone on a plane, but here we are.

## How It Got Made

Five days. Pair-programmed with Claude. I described features, Claude wrote code, I tested and iterated. The commit history tells the story: day one was a working Tetris engine, days two and three added competitive features and a leaderboard, days four and five were spent rebranding it to "Sadtris" and adding sad-internet-down error messages. The theming took almost as long as the game logic, which says something about priorities.

## Try It

```bash
git clone https://github.com/woojae/sadtris.git
cd sadtris
swift build -c release
```

Keep it around for your next flight. Or don't. It's fine either way.
