+++
title = 'Importing My Old Tumblr Into Hugo With AI'
date = 2026-02-26T10:00:00+09:00
draft = false
+++

I recently migrated my old Tumblr blog into this Hugo site. Tumblr was where I dumped links, videos, and random thoughts from 2014 to 2015. Most of it was reblogs and shared articles, but it felt wrong to just let it disappear. A few years ago, this kind of migration would have been a weekend project. With AI, I knocked it out in about an hour. There are still some broken links and images, but I'm pretty happy with the result, it feels like I perserved a bit of history.

## The Problem

Tumblr gives you a data export, but it's a mess. You get JSON with different post types (links, photos, videos, quotes, text), each with their own structure. To get these into Hugo, every post needs to be converted into a markdown file with proper front matter, working links, and correctly referenced images. I had hundreds of posts.

In the past, I would have written a Python script from scratch, referencing the Tumblr API docs, handling each post type, debugging edge cases one at a time. It's not hard work, but it's tedious. The kind of project that sits in your backlog because the effort-to-reward ratio is terrible.

## How AI Changed This

I used Claude Code to handle the entire migration.

### Writing the Conversion Script

Instead of writing a Tumblr-to-Hugo converter from scratch, I described what I needed and Claude generated a working script. It handled all the post type mappings: link posts became markdown links, photo posts became image references, YouTube URLs got converted to Hugo's `youtube` shortcode, and quotes became blockquotes. The script that would have taken me a couple hours to write and debug was done in minutes.

### Bulk Fixing Broken Content

This is where AI really shined. After the initial import, I had problems across hundreds of files:

- **164 files had broken links** where a space was inserted in the markdown syntax, turning `(<https://...>)` into `(< https://...>)`. Every single link on those pages was dead. Claude found the pattern with a single grep and fixed all 164 files in one command.

- **109 posts had generic titles** like "Post 127135850469" that were just empty reblogs. Claude identified and removed all of them.

- **72 files had broken image paths** pointing to a local `/media/` directory that didn't exist. Claude replaced all 117 image references to point to my CloudFront CDN.

Each of these fixes took about 30 seconds. Describe the problem, confirm the fix, done. Doing this by hand across 300+ markdown files would have been mind-numbing. Even writing a script for each fix would have taken longer than just telling the AI what to do.

The difference isn't that the individual tasks are hard. Any one of these fixes is a simple `sed` command or a short script. The difference is that AI eliminates the friction. You don't have to context-switch between reading docs, writing regex, testing it on one file, then running it on all files. You just describe the problem in plain English and move on to the next one.

## What I'd Suggest

If you have an old blog sitting on Tumblr, WordPress, or any other platform, now is the time to migrate it. The barrier used to be the tedious conversion work. AI has basically removed that barrier. Download your images, host them somewhere you control, and use an AI coding tool to handle the conversion and cleanup. The whole thing can be done in an afternoon.
