Given the URL: $ARGUMENTS

1. Fetch the URL and extract:
   - The page title
   - A brief 1-2 sentence description of what the page/article is about
   - The site or author name (for the "via" field)

2. Generate a slug from the title (lowercase, hyphens, no special characters).

3. Create a new Hugo content file at `content/links/<slug>.md` with this format:

```
+++
title = '<page title>'
date = <today's date in YYYY-MM-DDT15:04:05-07:00 format>
link = '<the original URL>'
via = '<site or author name>'
+++

<1-2 sentence description>
```

4. Show the user the created file content for review.
