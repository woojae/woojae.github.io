+++
title = 'Pomodoro Timer for macOS'
date = 2026-02-19T10:00:00+09:00
draft = false
+++

I built a minimal Pomodoro timer that lives in the macOS menu bar. There are many of these little Pomodoro apps on the internet, but most of them are scammy adware or charge a fee for bloated premium features I don't need. So I made my own that's free and designed exactly for my minimalist needs.

![Pomodoro Screenshot](https://d3nu6st0wla7pm.cloudfront.net/pomodoro-screenshot.png)

## Features

The app does exactly what I need and nothing more:

- 25-minute work timer, 5-minute break
- Start / Pause / Reset controls
- Circular progress ring with countdown in the menu bar
- Log what you're working on before each session
- Add notes during a session
- Reflect on what you accomplished after each session
- macOS notification when timer completes
- Plain text log file for easy querying
- Configurable log file location
- No dock icon — lives entirely in the menu bar

## Install

**Requires macOS 14+**

1. Download `Pomodoro-v1.0.zip` from the [latest release](https://github.com/woojae/pomodoro/releases/latest)
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

One of my favorite features is the plain text logging. Sessions are logged to `~/pomodoro.log` (configurable in Settings). Each line is tab-separated, making it easy to query with standard Unix tools:

```
2026-02-18 10:00:00	start	Fix login bug
2026-02-18 10:05:32	note	Found root cause in token refresh
2026-02-18 10:12:15	note	Also need to update tests
2026-02-18 10:25:00	done	Rewrote auth token refresh logic
```

## Shell Helper

I added this to my `~/.zshrc` to quickly query my pomodoro log:

```bash
pomo() {
  case "$1" in
    yesterday) grep "$(date -v-1d +%Y-%m-%d)" ~/pomodoro.log ;;
    search)    grep -i "$2" ~/pomodoro.log ;;
    *)         grep "$(date +%Y-%m-%d)" ~/pomodoro.log ;;
  esac
}
```

After running `source ~/.zshrc`, I can use:

```bash
pomo                    # today's entries
pomo yesterday          # yesterday's entries
pomo search login       # search all entries (case-insensitive)
```

The source code is available on [GitHub](https://github.com/woojae/pomodoro).
