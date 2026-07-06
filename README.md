# Ameresco Contract Risk Analyser

Internal web application for AI-powered contract risk analysis. Upload a PDF or Word contract, choose an analysis depth, and receive a plain-English risk report with traffic-light ratings — suitable for non-legal staff.

---

## Repository Structure

```
/
├── index.html                          # Single-file front end (HTML + CSS + JS)
├── logo-data.js                        # Embedded logo as a data URI
├── netlify/functions/claude-proxy.mjs  # Server-side proxy holding the API key
├── netlify.toml                        # Netlify build config and security headers
└── README.md                           # This file
```

---

## How it works

The browser never talks to the Anthropic API directly and never sees the API key. All AI calls go to `/api/claude`, a Netlify Function that:

1. Validates the shared site password sent with every request
2. Attaches the Anthropic API key (from an environment variable)
3. Streams Claude's response back to the browser

The login screen validates the password against the same function, so no password appears anywhere in the front-end code.

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

Netlify deploys automatically on every push to `main`, including the function in `netlify/functions/`.

### Step 2 — Set environment variables (required)

In Netlify: **Site configuration → Environment variables**

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | **Yes** | The Anthropic API key used for all analyses. Create one at [console.anthropic.com](https://console.anthropic.com) under a dedicated Ameresco account with a monthly spend limit set. |
| `SITE_PASSWORD` | Recommended | Overrides the default site password baked into the function code. |

**The app will not work until `ANTHROPIC_API_KEY` is set.** Users will see a clear "site is not fully configured" message.

After changing environment variables, trigger a redeploy so the function picks them up.

### Step 3 — Set a custom domain (optional)

1. Purchase a domain via Namecheap or GoDaddy
2. In Netlify: **Domain settings → Add a domain**
3. Follow the DNS configuration instructions Netlify provides

---

## Local Development

The front end depends on the Netlify Function, so use the Netlify CLI rather than opening `index.html` directly:

```bash
npm install -g netlify-cli
export ANTHROPIC_API_KEY=sk-ant-...   # or set in a .env file
netlify dev
```

This serves the site and the function together at `http://localhost:8888`.

---

## Security Notes

- The Anthropic API key lives only in a Netlify environment variable — it is never sent to the browser, never committed to the repository
- The site password is validated server-side by the function; it does not appear in any code delivered to the browser
- All Claude traffic goes through `/api/claude` on the same origin; the Content Security Policy blocks the browser from connecting anywhere else
- Security headers (X-Frame-Options, CSP, etc.) are set in `netlify.toml`
- Documents are processed in the browser and sent only to the proxy → Anthropic API; nothing is stored server-side

> If an Anthropic API key was ever committed to this repository or entered on the old admin panel, revoke and rotate it in the Anthropic console.

---

## Usage limits

- Maximum upload size: 50 MB
- PDFs: first 200 pages are processed
- Contract text: first ~400,000 characters are analysed (a warning is shown if truncated)
- Supported formats: `.pdf` and `.docx` (legacy `.doc` files must be re-saved as `.docx`)

---

*Internal use only. This tool provides preliminary analysis and does not constitute legal advice.*
