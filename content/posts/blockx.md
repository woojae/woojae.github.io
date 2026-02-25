+++
title = 'BlockX: Because I Cannot Be Trusted With the Internet'
date = 2026-02-24T18:00:00-08:00
draft = false
+++

## What Is BlockX?

[BlockX](https://github.com/woojae/blockx) is a bash script that modifies your `/etc/hosts` file to block distracting websites. It redirects them all to `127.0.0.1`, so when you try to open Reddit your browser just stares back at you like a disappointed parent.

It blocks the usual suspects: Facebook, Twitter/X, Instagram, Reddit, YouTube, and TikTok. It flushes your DNS cache so the block hits immediately. No grace period. No negotiating.

There's also a temporary unblock — 10 minutes of freedom before the gates close again. Like Cinderella, except instead of turning into a pumpkin, your Reddit feed turns into `localhost`.

## Why Bash?

Because bash is awesome. No dependencies. No `node_modules` folder the size of a small country. No Docker container running a Kubernetes cluster orchestrating a microservice that edits one file.

Just ~60 lines of shell, a hosts file, and `sudo`. The whole thing is probably smaller than the favicon on most websites that try to solve this problem.

## Get It

```bash
git clone https://github.com/woojae/blockx.git
cd blockx
sudo ./blockx.sh
```

Yes, it needs `sudo`. You are mass-grounding yourself from the internet. This is what it's come to.
