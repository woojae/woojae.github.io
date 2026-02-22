+++
title = 'I Built a macOS Pomodoro Timer with Claude Code'
date = 2026-02-19T10:00:00+09:00
draft = false
+++

I wanted a minimal Pomodoro timer that lives in the macOS menu bar. There are plenty of these apps out there, but most are scammy adware or charge a fee for bloated premium features I don't need. So I decided to make my own.

The whole thing was built using [Claude Code](https://docs.anthropic.com/en/docs/claude-code). I described what I wanted, and it just... made it. The best way I can describe the experience is that it's like having a magic genie that creates a toy for you on demand. I told it I wanted a menu bar timer with markdown logging and session notes, and within a single sitting I had a working macOS app. No Xcode fumbling, no hunting through SwiftUI docs, no Stack Overflow rabbit holes. Just describing what I wanted and watching it appear.

What surprised me most is that the app came out exactly right. Not over-engineered, not missing anything. It does what I need and nothing more. That almost never happens when you build something yourself — you always end up gold-plating some feature or forgetting another. Claude Code just stuck to the spec.

![Pomodoro Screenshot](https://d3nu6st0wla7pm.cloudfront.net/pomodoro-screenshot.png)

## Features

- Configurable work timer and break duration
- Start / Pause / Reset controls
- Circular progress ring with countdown in the menu bar
- Log what you're working on before each session
- Add detailed notes during a session — supports pasting multi-line markdown
- Reflect on what you accomplished after each session
- macOS notification when timer completes
- Daily markdown log files for easy reading and querying
- Configurable log folder location
- No dock icon — lives entirely in the menu bar

## How It Was Built

I ran Claude Code in my terminal and described the app conversationally. The workflow went something like this:

1. "I want a macOS menu bar app with a Pomodoro timer, no dock icon"
2. "Add a circular progress ring that shows the countdown"
3. "Before each session, prompt me to log what I'm working on"
4. "Let me add notes during a session with multi-line markdown support"
5. "After each session, ask me to reflect on what I accomplished"
6. "Save everything as daily markdown files"

Each prompt built on the last. Claude Code generated the Swift code, the project config, the build setup — all of it. I could iterate in real time: "make the notes field taller," "add a configurable log folder," "send a macOS notification when the timer finishes." It just worked.

If you've used AI coding tools before, this felt like a step change. With Cursor or Copilot, you're still driving — the AI fills in lines and you steer. With Claude Code, I described a complete app and got a complete app. The difference between autocomplete and a collaborator.

## Install

**Requires macOS 14+**

1. Download `Pomodoro-v1.2.zip` from the [latest release](https://github.com/woojae/pomodoro/releases/latest)
2. Unzip and drag `Pomodoro.app` to `/Applications`
3. Since the app isn't notarized, right-click the app and select **Open** the first time to bypass Gatekeeper
4. To start on login: **System Settings > General > Login Items > add Pomodoro.app**

## Build from Source

If you'd prefer to build it yourself:

```bash
brew install xcodegen
xcodegen generate
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild \
  -project Pomodoro.xcodeproj \
  -scheme Pomodoro \
  -configuration Release \
  build
cp -r ~/Library/Developer/Xcode/DerivedData/Pomodoro-*/Build/Products/Release/Pomodoro.app /Applications/
```

## Log Format

One of my favorite features is the daily markdown logging. Sessions are stored as one file per day in `~/pomodoro/` (configurable in Settings):

```
~/pomodoro/
├── 2026-02-17.md
├── 2026-02-18.md
└── 2026-02-19.md
```

Each file contains all sessions for that day, with full markdown support — so you can paste code blocks, lists, or any structured notes:

```markdown
## 10:00 — Fix login bug

### Notes

Found the issue in `auth.swift` — token refresh was using the wrong expiry.

Also need to update tests.

### Reflection

Rewrote auth token refresh logic

---

## 11:30 — Write unit tests

### Notes

Covered happy path and token expiry edge case.

### Reflection

Added 12 test cases, all passing

---
```

## Shell Helper

I added this to my `~/.zshrc` to quickly query my pomodoro logs:

```bash
pomo() {
  case "$1" in
    yesterday) cat ~/pomodoro/$(date -v-1d +%Y-%m-%d).md 2>/dev/null ;;
    search)    grep -ri "$2" ~/pomodoro/ ;;
    *)         cat ~/pomodoro/$(date +%Y-%m-%d).md 2>/dev/null ;;
  esac
}
```

After running `source ~/.zshrc`, I can use:

```bash
pomo                    # today's sessions
pomo yesterday          # yesterday's sessions
pomo search login       # search all sessions (case-insensitive)
```

The source code is available on [GitHub](https://github.com/woojae/pomodoro).
