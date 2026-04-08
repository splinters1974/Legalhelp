# Ameresco Contract Risk Analyser

Internal web application for AI-powered contract risk analysis. Upload a PDF or Word contract, choose an analysis depth, and receive a plain-English risk report with traffic-light ratings — suitable for non-legal staff.

---

## Repository Structure

```
/
├── index.html       # Single-file application (HTML + CSS + JS)
├── netlify.toml     # Netlify build config and security headers
└── README.md        # This file
```

---

## Deploying to Netlify

### Step 1 — Connect the repository

1. Log in to [Netlify](https://app.netlify.com)
2. Click **Add new site → Import an existing project**
3. Connect to GitHub and select the **splinters1974/Legalhelp** repository
4. Build settings:
   - **Build command:** *(leave blank — static site)*
   - **Publish directory:** `.`
5. Click **Deploy site**

Netlify will deploy automatically on every push to `main`.

### Step 2 — Set a custom domain (optional but recommended)

1. Purchase a domain (e.g. `ameresco-tools.com`) via Namecheap or GoDaddy
2. In Netlify: **Domain settings → Add a domain**
3. Follow the DNS configuration instructions Netlify provides

### Step 3 — Enable password protection

Netlify password protection is configured in the dashboard, not via a file:

1. Go to **Site configuration → Access control → Visitor access**
2. Select **Password protection**
3. Set a shared password and click **Save**
4. All staff will use this single password to access the tool

> Note: For v2, individual user accounts can be added via Netlify Identity or a backend proxy.

---

## API Key

Users enter their Anthropic API key when they first open the tool. The key:

- Is validated client-side (must start with `sk-ant`)
- Is stored in `sessionStorage` only — cleared when the browser tab closes
- Is **never** sent anywhere except directly to `api.anthropic.com`
- Is **never** hardcoded into the source code

### Setting up a dedicated Anthropic account

1. Create an account at [console.anthropic.com](https://console.anthropic.com) using an Ameresco business email
2. Add a company payment method
3. Set a monthly spend limit under **Settings → Billing**
4. Create an API key under **Settings → API Keys** and distribute to authorised staff

---

## Build Chunks (development progress)

| Chunk | Status | Description |
|-------|--------|-------------|
| 1 — Foundation | ✅ Complete | HTML/CSS scaffold, netlify config, repo setup |
| 2 — Document Processing | 🔲 Pending | PDF and Word text extraction |
| 3 — Claude Integration | 🔲 Pending | Structured JSON prompts, API call, response parsing |
| 4 — Results Display | 🔲 Pending | Risk cards, clause breakdown, recommendations |
| 5 — Report Generation | 🔲 Pending | PDF and Word download with professional formatting |
| 6 — Polish & Deploy | 🔲 Pending | Error handling, mobile, final hardening |

---

## Local Development

No build step required. Open `index.html` directly in a browser, or serve with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Security Notes

- API key is runtime-entered and session-scoped — no server-side storage in v1
- Security headers set in `netlify.toml` (X-Frame-Options, CSP, etc.)
- Content Security Policy restricts outbound connections to `api.anthropic.com` only
- Password protection at Netlify level prevents public access

---

*Internal use only. This tool provides preliminary analysis and does not constitute legal advice.*
