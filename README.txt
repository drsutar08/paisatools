PAISATOOLS SITE: HOW TO PUT IT ONLINE
=====================================

What's in this folder
---------------------
index.html                  Home page with all 11 calculators
*-calculator.html           The calculators: EMI, income tax, HRA, GST,
                            gratuity, SIP, FD, RD, PPF, Sukanya Samriddhi, NPS
about.html, contact.html, privacy-policy.html, disclaimer.html
                            Pages AdSense expects every site to have
404.html                    Shown when someone opens a broken link
sitemap.xml, robots.txt     Help Google find every page
ads.txt                     For AdSense, fill in after approval

Step 1: Choose your name and domain
-----------------------------------
Buy a domain (a .in or .com costs about Rs 800-1,000 a year from GoDaddy,
Hostinger, Namecheap or Cloudflare).

Your site address (https://drsutar08.github.io/paisatools/) is already set in every file.
If you ever move to your own domain, use Find and Replace across all files:
  https://drsutar08.github.io/paisatools   ->  your new address
If you want a different brand name, also replace "PaisaTools", "paisatools"
and "paisa<span>tools</span>" (the logo in the header).

Visitor count (optional, free):
  1. Sign up at https://www.goatcounter.com and choose a site code.
  2. Find and replace YOURCODE with that code in all files.
  3. See your visitors at https://YOURCODE.goatcounter.com (your own code).

Step 2: Put it online for free (Netlify, easiest)
-------------------------------------------------
1. Go to https://app.netlify.com/drop and sign up for free.
2. Drag this whole folder onto the page. Your site goes live in seconds
   on a free netlify.app address.
3. In Netlify, open Domain management and add your own domain. Follow the
   steps to point your domain's DNS to Netlify. HTTPS is set up for you.
To update the site later, drag the folder onto the Deploys page again.

(Cloudflare Pages and GitHub Pages also work and are free.)

Step 3: Tell Google about the site
----------------------------------
1. Go to Google Search Console (search.google.com/search-console).
2. Add your domain and verify it (Netlify or your domain provider shows how).
3. Under Sitemaps, submit:  sitemap.xml
New sites usually take a few weeks to start showing in search results.

Step 4: Apply for AdSense
-------------------------
Google tends to approve sites with real content and steady visitors, so it
helps to wait until Google has indexed your pages and you have some visitors.
1. Sign up at https://adsense.google.com with your domain.
2. AdSense gives you a <script> tag. Paste it in the <head> of EVERY page,
   where you see the comment "AdSense: after approval, paste...".
3. After approval, create ad units and replace each dashed placeholder
   (look for the comment "AdSense: replace this placeholder div").
4. Copy the line AdSense shows under Sites > ads.txt into ads.txt.

Every February: review the income tax page
------------------------------------------
Check the Union Budget for changes to tax slabs, the rebate, the standard
deduction and capital gains tax, and update income-tax-calculator.html and
the tax section of sip-calculator.html.

Every quarter (1 Jan, 1 Apr, 1 Jul, 1 Oct): check small savings rates
---------------------------------------------------------------------
The government announces PPF, Sukanya Samriddhi, post office RD and time
deposit rates every quarter. If they change, update the default rate and
the rate shown in the text on ppf-calculator.html,
sukanya-samriddhi-calculator.html, rd-calculator.html and fd-calculator.html
(search for "October–December 2026").


New files and what they do
--------------------------
  theme.css, calc-base.css, calc-common.js   shared look and calculator helpers
  site.js          dark/light switch, share link, print, cookie notice, offline support
  sw.js, manifest.webmanifest, icon-*.png   install-on-phone and offline support
                   (change CACHE name in sw.js each time you publish big updates)
  guides.html, guide-*.html                  money guides
  hi/index.html    Hindi home page
  tests/run.js     run:  node tests/run.js   (checks calculator formulas)

Adding or changing pages
------------------------
  node tools/sync.js     rebuilds the menu, footer, "More calculators" box, skip link and sitemap
                         on every page (English and Hindi). Add new calculators to
                         tools/site.config.js first.
  node tests/run.js      checks the calculator formulas.
  hi/                    Hindi versions of all 24 calculators and the home page.
  tools/make-og.js       makes the sharing images in og/ (needs Edge or Chrome installed)
  tests/                 cd tests, npm install (once), then npm test: checks every calculator,
                         English and Hindi, in a browser-like environment

Clean web addresses
-------------------
Pages are linked without ".html" (for example /emi-calculator), the same way GitHub Pages serves them.
Opening the files by double-clicking will not follow those links, so preview locally with:
   double-click  start-local.bat        (Windows), or run   node tools/serve.js
Then open http://localhost:8080/ (the script tells you if it had to use another port).
Running  node tools/sync.js  keeps every link in this style.
