// Netlify function to proxy requests to Google Cloud Text-to-Speech using an API key
// Expects JSON POST body: { text: string, lang: string, audioEncoding?: 'MP3'|'LINEAR16' }
// Requires GOOGLE_API_KEY to be set in Netlify environment variables.

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server missing GOOGLE_API_KEY' }) };
    }

    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (e) { body = {}; }
    const text = body.text || body.input || '';
    const lang = body.lang || 'en-US';
    const audioEncoding = (body.audioEncoding || 'MP3').toUpperCase();
    if (!text) return { statusCode: 400, body: JSON.stringify({ error: 'Missing text' }) };

    const payload = {
      input: { text },
      voice: { languageCode: lang, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding }
    };

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      // Log provider error for Netlify function logs (safe: does not log API key)
      console.error('[TTS] Google API error', { status: resp.status, statusText: resp.statusText, body: errText });
      return {
        statusCode: resp.status || 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'TTS provider error', status: resp.status, detail: errText })
      };
    }

    const data = await resp.json();
    if (!data || !data.audioContent) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No audio returned from provider' }) };
    }

    // Return JSON with base64 audioContent so the client can decode and play it
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ audioContent: data.audioContent })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error', detail: (e && e.message) || String(e) }) };
  }
};
