MMONSTERPATCH GITHUB PAGES STARTER
==================================

WHAT THIS IS
------------
A safe static website starter for:
https://mmonsterpatch.gamingwithgoose.com

It includes:
- Original green / cream / gold field-guide theme
- Responsive home page
- Static community-feed preview
- Links to the existing MMOnsterpatch account website
- Live server-status request with a safe fallback
- Original SVG logo and favicon
- CNAME and .nojekyll files for GitHub Pages

IMPORTANT LIMITATION
--------------------
GitHub Pages can host HTML, CSS, JavaScript, and images. It cannot run the
account database or a real social-media backend. Registration and login remain
on https://account.gamingwithgoose.com until the future social app is deployed
on your server.

UPLOAD INSTRUCTIONS
-------------------
1. Open the GitHub repository used by GitHub Pages.
2. Open the Code tab.
3. Upload every file and the assets folder from this pack to the repository root.
4. Commit the files to main.
5. Open Actions and wait for "pages build and deployment" to show a green check.
6. Open https://mmonsterpatch.gamingwithgoose.com

Do not upload the Server(2).zip archive, database.ini, server logs, account data,
or Python server modules to a public repository.

EDITING LINKS
-------------
Open config.js to change public URLs. Never place passwords or secret keys in it.

LIVE STATUS / CORS
------------------
The page requests:
https://account.gamingwithgoose.com/api/launcher/status

If the status card says it is unavailable, the account website likely needs this
response header for that endpoint:

Access-Control-Allow-Origin: https://mmonsterpatch.gamingwithgoose.com

A stricter implementation should allow only the public community origin rather
than using *.

FILES
-----
index.html          Main landing page
community.html      Static social-network design preview
about.html          Project explanation
privacy.html        Clearly marked privacy-policy placeholder
404.html            Custom not-found page
config.js           Safe public site configuration
assets/styles.css   Theme and responsive layout
assets/app.js       Menu, links, demo likes, status request
assets/logo.svg     Original project emblem
assets/favicon.svg  Browser icon
CNAME               Custom GitHub Pages domain
.nojekyll           Prevents Jekyll processing

NEXT DEVELOPMENT PHASE
----------------------
Build a server-hosted ASP.NET social application that shares the existing
MMOnsterpatch account identity and exposes only approved profile/rank data.
