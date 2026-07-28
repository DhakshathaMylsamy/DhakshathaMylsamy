# Hosting this on GitHub Pages

1. Create a repo named exactly `DhakshathaMylsamy.github.io` (your username + `.github.io`).
2. Upload **everything in this folder** to the root of that repo, keeping the structure:
   ```
   index.html
   projects.html
   experience.html
   ieee.html
   blog.html
   blog-post-template.html
   annex.html
   assets/style.css
   assets/app.js
   assets/img/volunteering/   ← your photos go here
   ```
3. Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
4. Live in ~1 minute at `https://dhakshathamylsamy.github.io`.

## Adding your volunteering photos

The IEEE page already has photo slots wired up — they're just empty right now, showing a dashed "+ add photo" placeholder. To fill them:

1. Drop your image files into `assets/img/volunteering/`, using these exact filenames (rename your photos to match, or edit the filenames in `ieee.html` to match your photos — either works):
   - `2026-move-training.jpg`
   - `2026-embc-poster.jpg`
   - `2026-apscon-myosa.jpg`
   - `2025-fleps-singapore.jpg`
   - `2025-ieeextreme.jpg`
   - `2025-returning-mothers.jpg`
   - `2024-stemthem-nilgiris.jpg`
   - `2024-pathfinder.jpg`
2. Push. The placeholders disappear automatically and your photos appear — no other edit needed.
3. Want more or fewer photos per year? Copy or delete a `<div class="photo-tile">...</div>` block in `ieee.html`.
4. Keep images reasonably sized (under ~500KB each, landscape works best) so the page loads fast — any phone photo resized to ~1200px wide is plenty.

## Adding a blog post

`blog.html` currently shows an empty state. To publish your first post:
1. Duplicate `blog-post-template.html`, rename it to something like `bio-vision-surgical-writeup.html`.
2. Edit the title, date, and body text inside it.
3. In `blog.html`, delete the `.empty-state` div and uncomment/adapt the `.blog-list` example block, pointing it at your new file.
4. Repeat for each new post — just add another `.blog-row` link.
