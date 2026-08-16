# Jaiswal Vaivaahiki — Matrimonial Biodata Generator

A free, no-signup web app to create a beautiful matrimonial biodata (Hindi & English) and download it as a PDF — works on mobile and desktop.

**🔗 Live demo:** _add your deployed link here once hosted_

## Features

- 📝 Step-by-step guided form (Personal, Education, Work, Family, Partner Preference, Contact, Photos, Declaration)
- 👀 Live preview before download
- 📄 One-click PDF download — **100% free**, no payment, no login
- 🖨️ Print support
- 🌐 Hindi / English language toggle
- 🎨 Multiple biodata templates/themes
- 📱 Fully responsive — mobile, tablet, and desktop
- 🔒 Everything runs in the browser — no data is uploaded to any server

## Tech Stack

- HTML5, CSS3 (Bootstrap 5 + custom styles)
- Vanilla JavaScript (no framework, no build step)
- [html2canvas](https://github.com/niklasvh/html2canvas) + [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation

## Project Structure

```
.
├── index.html          # Main app (landing page + multi-step form)
├── scripts/
│   ├── app.js           # App bootstrap / init
│   ├── form.js           # Multi-step form logic
│   ├── validation.js     # Field validation
│   ├── storage.js        # Local draft persistence
│   ├── preview.js         # Live preview rendering
│   ├── pdf.js              # PDF generation & download
│   ├── gallery.js          # Template gallery
│   ├── positions.js        # Layout positioning helpers
│   ├── theme.js             # Theme/template switching
│   ├── language.js          # Hindi/English toggle
│   ├── config.js             # App-level config
│   ├── bootstrap.bundle.min.js
│   ├── html2canvas.min.js
│   └── jspdf.umd.min.js
├── styles/
│   ├── style.css        # Core styles
│   ├── responsive.css    # Mobile/tablet breakpoints
│   ├── print.css          # Print-specific styles
│   ├── bootstrap.min.css
│   ├── all.min.css         # Font Awesome
│   └── css2.css             # Google Fonts (Cinzel etc.)
└── images/               # Icons, fonts, templates, sample images
```

## Running Locally

No build step needed — it's a static site.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Option 1: just open it
open index.html          # macOS
start index.html         # Windows

# Option 2: serve it (recommended, avoids some browser file:// restrictions)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` folder.
4. Save — your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## License

MIT — see [LICENSE](LICENSE). Free to use, modify, and share.
