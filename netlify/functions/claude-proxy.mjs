// Ameresco Contract Risk Analyser — server-side proxy for the Anthropic API.
//
// The Anthropic API key never reaches the browser: it is read from the
// ANTHROPIC_API_KEY environment variable (set in the Netlify dashboard under
// Site configuration → Environment variables).
//
// Access is gated by a shared site password. Override the default by setting
// the SITE_PASSWORD environment variable.

const DEFAULT_SITE_PASSWORD = 'Splinters1';

function sitePassword() {
    return process.env.SITE_PASSWORD || DEFAULT_SITE_PASSWORD;
}

export default async (req) => {
    if (req.method !== 'POST') {
        return Response.json({ error: { message: 'Method not allowed' } }, { status: 405 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: { message: 'Invalid request body' } }, { status: 400 });
    }

    if ((body.password || '') !== sitePassword()) {
        return Response.json({ error: { type: 'auth', message: 'Incorrect password.' } }, { status: 401 });
    }

    // Lightweight password check used by the login screen
    if (body.action === 'verify') {
        return Response.json({ ok: true });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return Response.json({
            error: {
                type: 'config',
                message: 'The site is not fully configured: ANTHROPIC_API_KEY is not set. ' +
                    'An administrator needs to add it under Site configuration → Environment variables in Netlify.',
            },
        }, { status: 500 });
    }

    const payload = body.payload;
    if (!payload || !payload.model || !payload.messages) {
        return Response.json({ error: { message: 'Missing or invalid payload' } }, { status: 400 });
    }

    // Always stream: long analyses would otherwise exceed the buffered
    // function response window. The SSE stream is piped straight through
    // to the browser, which reassembles the text.
    payload.stream = true;

    let upstream;
    try {
        upstream = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(payload),
        });
    } catch {
        return Response.json({
            error: { type: 'upstream', message: 'Could not reach the Anthropic API. Please try again.' },
        }, { status: 502 });
    }

    return new Response(upstream.body, {
        status: upstream.status,
        headers: {
            'content-type': upstream.headers.get('content-type') || 'application/json',
            'cache-control': 'no-store',
        },
    });
};

export const config = { path: '/api/claude' };
