+++
title = 'BlockX: Because I Cannot Be Trusted With the Internet'
date = 2026-02-25T12:00:00+09:00
draft = false
+++

## The Problem Nobody Asked Me to Solve (But I Solved Anyway)

Let me paint you a picture. It's 9:00 AM. You sit down at your desk, coffee in hand, ready to be **incredibly productive**. You open your terminal. You open your editor. You open— wait, let me just check Reddit real quick.

It's now 11:47 AM. You know everything about a stranger's divorce, the optimal way to stack a dishwasher, and why a particular movie from 2003 is actually a masterpiece. You have written zero lines of code.

Sound familiar? Yeah. That's why I built [BlockX](https://github.com/woojae/blockx).

## What Is BlockX?

BlockX is a bash script that modifies your `/etc/hosts` file to block distracting websites. That's it. That's the whole thing. It's mass self-discipline delivered via `sudo`.

It blocks the usual suspects:

- **Facebook** — Because nobody needs to see what their coworker had for lunch
- **Twitter/X** — The website formerly known as a website that worked
- **Instagram** — You do not need to see another latte art photo
- **Reddit** — The front page of procrastination
- **YouTube** — "Just one video" is the greatest lie ever told
- **TikTok** — Congratulations, you just lost 3 hours to a hamster eating a tiny burrito

## How It Works

The technical explanation is beautifully simple:

```bash
# Your /etc/hosts file, before BlockX:
# (nothing interesting)

# Your /etc/hosts file, after BlockX:
127.0.0.1 www.facebook.com
127.0.0.1 facebook.com
127.0.0.1 www.twitter.com
127.0.0.1 twitter.com
# ... you get the idea
```

BlockX points all those distracting domains to `127.0.0.1`, which is your own computer. So when you try to open Reddit, your browser just stares back at you like a disappointed parent. "There's nothing here. Go do your work."

It even flushes the DNS cache so the block takes effect immediately. No loopholes. No "well technically if I wait 30 seconds..." — instant digital intervention.

## The Unblock Feature (a.k.a. The Weakness)

Here's where it gets psychologically interesting. BlockX has a temporary unblock feature. You can grant yourself a 10-minute window to access the blocked sites, after which they automatically get re-blocked.

Ten minutes. That's the allowance. Like a parent letting their kid have *one* piece of candy.

The idea is: maybe you actually need to check something on YouTube for work. Maybe you have a legitimate reason to visit Twitter. (I can't think of one, but maybe you can.)

After 10 minutes, the gates close again. It's like Cinderella, except instead of turning into a pumpkin, your Reddit feed turns into `localhost`.

## Why a Bash Script?

I could have built a fancy Electron app with a React frontend and a GraphQL API and a Kubernetes cluster to manage my website-blocking needs. But that would have taken weeks, during which I'd have spent approximately 400 hours on the very websites I was trying to block.

Instead: 60-ish lines of bash. No dependencies. No `node_modules` folder the size of a small country. Just a script, a hosts file, and the fading remnants of my willpower.

## Installation: A Cry for Help in Three Steps

```bash
git clone https://github.com/woojae/blockx.git
cd blockx
chmod +x blockx.sh
```

Then run it with:

```bash
sudo ./blockx.sh
```

Yes, it needs `sudo`. Because you're editing `/etc/hosts`. Because you are mass-grounding yourself from the internet. This is what it's come to.

## Does It Actually Work?

Here is my completely unscientific before/after:

**Before BlockX:**
- 9:00 AM — Sit down to work
- 9:01 AM — "Let me just check one thing..."
- 12:30 PM — Emerge from Reddit like a submarine surfacing
- 12:31 PM — Existential regret
- 12:45 PM — Start actual work

**After BlockX:**
- 9:00 AM — Sit down to work
- 9:01 AM — Try to open Reddit, get `localhost`
- 9:02 AM — Try to open Twitter, get `localhost`
- 9:03 AM — Try to open YouTube, get `localhost`
- 9:04 AM — Stare at terminal
- 9:05 AM — Fine. I'll write code.
- 12:00 PM — Have actually accomplished things
- 12:01 PM — Unblock YouTube for 10 minutes as a reward
- 12:11 PM — Back to the void

Progress? Maybe. Healthy? Debatable. Effective? Absolutely.

## The Philosophical Question

At what point does a person realize they need to write a *program* to stop themselves from looking at websites? Is this peak engineering or a cry for help? The answer, of course, is yes.

But here's the thing — it works. And sometimes the best tool isn't the most sophisticated one. Sometimes it's just a bash script that tells your computer to pretend the internet doesn't exist.

Now if you'll excuse me, my 10-minute unblock window just expired and I have work to do.

Check it out: [github.com/woojae/blockx](https://github.com/woojae/blockx)
