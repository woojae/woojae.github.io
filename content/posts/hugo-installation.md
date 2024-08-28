+++
title = 'Hugo Installation'
date = 2024-08-28T11:00:33+09:00
draft = false
+++

I’ve successfully migrated my website to Hugo. The whole point of this move was to build a simple, no-nonsense webpage that’s free to host, scales infinitely, and will stand the test of time. With Hugo, the site is statically rendered, so all I have to do is compress my files and upload them to any web server. The content is written in Markdown, I’m confident will stick around for the long haul. Even if Hugo one day bites the dust or stops getting updates, I’ll still have my trusty Markdown and HTML files, which means my site can live on forever.

This approach is better than getting tangled up in a complex framework or relying on a platform that needs a database. For a straightforward website like mine, a database is overkill—adding unnecessary layers of complication. Why burden myself with a heavy framework when a lightweight, static site generator like Hugo nails it perfectly? Keep it simple, and you’ll thank yourself later.

I love statically rendered sites, it brings back memories of the good old days when you’d just FTP your files up to a server, and boom, you had a website. No fuss, no complicated setups, just pure simplicity. It’s like a throwback to when the web was all about getting content out there without jumping through hoops. Hugo taps into that same vibe, where you can focus on what really matters without being bogged down by unnecessary complexities. It’s refreshing to go back to basics and know that your site will be rock-solid and future-proof, just like the old days.

Here’s a step-by-step explanation of how I created my website using Hugo and deployed it to GitHub Pages, along with the process for updating the DNS settings on GoDaddy to point to the new website.

### Step 1: Install Hugo
1. **Download Hugo**: First, I went to the [official Hugo website](https://gohugo.io/getting-started/installing) and followed the instructions to install Hugo. Depending on your operating system, the installation might differ slightly. I used the command line to install it.
   - On Mac: `brew install hugo`
   - On Windows: Use the Windows installer or install via package managers like `chocolatey`.

2. **Verify Installation**: After installation, I verified Hugo was set up by running:
   ```
   hugo version
   ```

### Step 2: Set Up a New Hugo Project
1. **Create a New Site**: I created a new Hugo project by running:
   ```
   hugo new site my-website
   ```
   This generated the basic directory structure.

2. **Choose a Theme**: I browsed [Hugo Themes](https://themes.gohugo.io/) and picked one that suited my needs. After downloading it, I added it to my Hugo project’s `/themes` directory and updated my `config.toml` file to apply the theme.

3. **Create Content**: To start writing content, I used Markdown, which is Hugo's native format. For example:
   ```
   hugo new posts/my-first-post.md
   ```
   I then edited the markdown file in `content/posts/` to fill in my article.

### Step 3: Build the Static Website
Once I had my content ready, I used Hugo to generate the static files:
```
hugo
```
This command created the fully rendered website in the `public/` folder, which was ready to be uploaded to a web server.

### Step 2: Prepare Your Hugo Project

1. **Ensure Your Project Is Set Up**: Before diving into GitHub Actions, make sure your Hugo project is ready. This includes having your content, theme, and configuration files (`config.toml` or `config.yaml`) set up.

2. **Push Your Project to GitHub**: 
   - If you haven’t already, push your Hugo project to a GitHub repository:
     ```
     git init
     git remote add origin https://github.com/username/my-website.git
     git add .
     git commit -m "Initial commit"
     git push -u origin master
     ```

### Step 3: Set Up GitHub Actions for Deployment

1. **Create a GitHub Actions Workflow File**:
   - In your Hugo project’s repository, navigate to the `.github/workflows/` directory. If it doesn’t exist, create it.
   - Inside the `workflows` directory, create a new file called `deploy.yml` (you can name it anything, but `deploy.yml` is descriptive).

2. **Add the Workflow Configuration**:
   - Open the `deploy.yml` file and add the following content to set up the GitHub Actions workflow:

     ```yaml
     # Sample workflow for building and deploying a Hugo site to GitHub Pages
     name: Deploy Hugo site to Pages
     
     on:
       # Runs on pushes targeting the default branch
       push:
         branches:
           - main
     
       # Allows you to run this workflow manually from the Actions tab
       workflow_dispatch:
     
     # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
     permissions:
       contents: read
       pages: write
       id-token: write
     
     # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
     # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
     concurrency:
       group: "pages"
       cancel-in-progress: false
     
     # Default to bash
     defaults:
       run:
         shell: bash
     
     jobs:
       # Build job
       build:
         runs-on: ubuntu-latest
         env:
           HUGO_VERSION: 0.128.0
         steps:
           - name: Install Hugo CLI
             run: |
               wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
               && sudo dpkg -i ${{ runner.temp }}/hugo.deb          
           - name: Install Dart Sass
             run: sudo snap install dart-sass
           - name: Checkout
             uses: actions/checkout@v4
             with:
               submodules: recursive
               fetch-depth: 0
           - name: Setup Pages
             id: pages
             uses: actions/configure-pages@v5
           - name: Install Node.js dependencies
             run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
           - name: Build with Hugo
             env:
               HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
               HUGO_ENVIRONMENT: production
               TZ: America/Los_Angeles
             run: |
               hugo \
                 --gc \
                 --minify \
                 --baseURL "${{ steps.pages.outputs.base_url }}/"          
           - name: Upload artifact
             uses: actions/upload-pages-artifact@v3
             with:
               path: ./public
     
       # Deployment job
       deploy:
         environment:
           name: github-pages
           url: ${{ steps.deployment.outputs.page_url }}
         runs-on: ubuntu-latest
         needs: build
         steps:
           - name: Deploy to GitHub Pages
             id: deployment
             uses: actions/deploy-pages@v4
     
          ```

   This workflow file does the following:
   - **Checkout code**: Retrieves the latest code from the repository.
   - **Setup Hugo**: Installs Hugo on the runner (the virtual machine GitHub Actions uses to execute tasks).
   - **Build the website**: Executes the Hugo build command to generate the static files.
   - **Deploy to GitHub Pages**: Pushes the contents of the `public` directory (where Hugo outputs the static files) to the `gh-pages` branch.

3. **Commit and Push the Workflow File**:
   - After creating the workflow file, commit it to your repository:
     ```
     git add .github/workflows/deploy.yml
     git commit -m "Add GitHub Actions workflow for deployment"
     git push
     ```

### Step 4: Configure GitHub Pages

1. **Enable GitHub Pages**:
   - Go to the repository settings on GitHub.
   - Scroll down to the **GitHub Pages** section.
   - Set the source to the `gh-pages` branch.

2. **Force HTTPS**: 
   - Ensure the "Enforce HTTPS" option is enabled for a secure connection.

### Step 5: Update DNS on GoDaddy

1. **Get GitHub Pages IP Addresses**:
   - Use the same four IP addresses as before for GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

2. **Log into GoDaddy**:
   - Navigate to the DNS management for your domain.

3. **Update A Records**:
   - Remove any existing A records pointing elsewhere.
   - Add the four A records with the GitHub Pages IP addresses, each set to the `@` symbol for the host.

4. **Add a CNAME Record**:
   - Create a CNAME record pointing your `www` subdomain to `username.github.io`.

5. **Save DNS Changes**:
   - Save the DNS settings and wait for propagation.

### Step 6: Trigger the Workflow

1. **Make Changes and Push**:
   - Whenever you push changes to the `master` branch (or the branch you specified in your workflow), the GitHub Actions workflow will automatically build and deploy your site to GitHub Pages.

2. **Monitor the Workflow**:
   - You can monitor the progress of the GitHub Actions workflow by going to the "Actions" tab in your GitHub repository. It will show you the build and deployment status.

### Step 7: Verify the Deployment

1. **Check Your Domain**:
   - Once the DNS changes have propagated, visit your custom domain to ensure it’s pointing to the GitHub Pages site.

2. **Troubleshoot**:
   - If there are any issues, check the logs in the GitHub Actions workflow and make sure your DNS settings are correct.

---

By following these steps, your Hugo website will be automatically built and deployed to GitHub Pages using GitHub Actions, and your custom domain will be properly configured using GoDaddy's DNS settings. This setup not only streamlines the deployment process but also ensures your site is always up to date with the latest changes.

Honestly all these steps seems like its too hard. But I have not found anything easier, can't wait till the AI can do all this for me. The funny thing is the AI was great at helping me create this document. 