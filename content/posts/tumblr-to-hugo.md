+++
title = 'Importing My Old Tumblr Into Hugo With AI'
date = 2026-02-26T10:00:00+09:00
draft = false
+++

I recently migrated my old Tumblr blog into this Hugo site. Tumblr was where I dumped links, videos, and random thoughts from 2014 to 2015. Most of it was reblogs and shared articles, but it felt wrong to just let it disappear. 6 months ago, this kind of migration would have been a weekend project. With AI, I knocked it out in about an hour. There are still some broken links and images, but I'm pretty happy with the result, it feels like I perserved a bit of history.

In the past, I would have written a script from scratch, referencing the Tumblr API docs, handling each post type, debugging edge cases one at a time. Its super fun to do, but I have laundry to do. I also have a wife and kids who wants do something "fun" together.

### Bulk Fixing Broken Content

This is where AI really shined. After the initial import, I had problems across hundreds of files:

- **164 files had broken links** where a space was inserted in the markdown syntax, turning `(<https://...>)` into `(< https://...>)`. Every single link on those pages was dead. Claude found the pattern with a single grep and fixed all 164 files in one command.

- **109 posts had generic titles** like "Post 127135850469" that were just empty reblogs. Claude identified and removed all of them.

- **72 files had broken image paths** pointing to a local `/media/` directory that didn't exist. Claude replaced all 117 image references to point to my CloudFront CDN.

Each of these fixes took about 30 seconds.  Yes we are screwed the robots will kill us all.
