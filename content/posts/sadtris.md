+++
title = 'Sadtris: Building a Native macOS Tetris Clone with SwiftUI and Claude'
date = 2026-02-25T12:00:00+09:00
draft = false
+++

## The Pitch

You're on a plane. No Wi-Fi. You want to play Tetris. You open the App Store — oh wait, you can't, because you're on a plane. Even if you could, every Tetris app is either riddled with ads or wants a subscription for a game that was designed in 1984.

So I built my own. [Sadtris](https://github.com/woojae/sadtris) is a native macOS Tetris clone built entirely with SwiftUI. No dependencies. No network calls. No ads. Just blocks falling down a screen, the way nature intended.

The name? It's a sad Tetris clone. The only reason you'd use it is if you're on a plane, or in the woods, or if the internet is down — which is, admittedly, a sad situation.

## The 5-Day Sprint

I built Sadtris over 5 days, pair-programming with Claude Opus 4.5. The whole thing lives in a single Swift file. Here's roughly how the week went:

- **Day 1** — Got the core Tetris engine running: board, tetrominoes, gravity, line clears, rotation with wall kicks.
- **Day 2-3** — Added modern competitive features: hold piece, ghost piece, lock delay, DAS/ARR, T-spin detection, and a persistent leaderboard.
- **Day 4-5** — Rebranded to "Sadtris," added the BSOD/sad-internet-down theme, polished the icon, and cleaned everything up.

## What's Under the Hood

The entire game — app entry point, game state, rendering, input handling, overlays — is a single file: `SadtrisApp.swift`. No modular architecture, no MVVM, no coordinator pattern. Just one file that does one thing.

### Rendering

The board uses SwiftUI's `Canvas` for rendering instead of laying out individual views per cell. Each locked piece gets a highlight on top and a shadow on the bottom for a bit of visual depth. The ghost piece renders at 40% opacity so you can see where your piece will land.

### Modern Tetris Mechanics

This isn't your dad's Tetris. Sadtris implements several mechanics that competitive players expect:

- **Hold Piece** — Press `C` to stash your current piece and swap it back later (one swap per drop).
- **Lock Delay** — When a piece touches down, you get 0.5 seconds and up to 15 additional moves before it locks. This lets you slide pieces into tight spots.
- **DAS/ARR** — Delayed Auto Shift (0.17s) and Auto Repeat Rate (0.05s) for held directional keys, matching competitive Tetris standards.
- **Wall Kicks** — Rotation attempts offsets of ±1 and ±2 columns before giving up, so pieces can rotate in tight spaces.
- **T-Spin Detection** — The game checks the four corners around the T-piece center after rotation and awards bonus points for full and mini T-spins.

### Scoring

The scoring follows standard guidelines-style Tetris:

| Action | Points |
|---|---|
| Single | 100 × level |
| Double | 300 × level |
| Triple | 500 × level |
| Tetris | 800 × level |
| Full T-Spin (no lines) | 400 × level |
| Full T-Spin Triple | 1600 × level |
| Hard Drop | 2 per cell |

Every 10 lines cleared bumps you up a level, and the drop speed increases accordingly.

### Input Handling

One quirk of building a game in SwiftUI for macOS: keyboard handling requires wrapping an `NSView` via `NSViewRepresentable`. Key repeat is suppressed for discrete actions like hard drop and hold, while soft drop uses a fast tick interval (0.05s) for smooth gameplay.

## The Controls

| Key | Action |
|---|---|
| ← → | Move piece |
| ↑ | Rotate |
| ↓ | Soft drop |
| Space | Hard drop |
| C | Hold piece |
| P | Pause |
| R | Restart |

## Zero Dependencies

The `Package.swift` declares a single executable target. No SPM packages, no CocoaPods, no Carthage. Everything is built on Apple's native frameworks: SwiftUI for the UI, AppKit (via `NSViewRepresentable`) for keyboard input, and `UserDefaults` for persisting the top 5 high scores.

Building is straightforward:

```bash
swift build -c release
```

Then copy the executable and icon into a `.app` bundle and you're done.

## Pair Programming with AI

Every meaningful commit was co-authored with Claude. The workflow felt natural — I'd describe what I wanted (e.g., "add T-spin detection with animated notifications"), Claude would generate the implementation, and I'd review, test, and iterate. For a self-contained project like this with clear specs, AI pair programming was genuinely productive.

## Try It

The source is at [github.com/woojae/sadtris](https://github.com/woojae/sadtris). Clone it, build it, and keep it around for your next flight.
