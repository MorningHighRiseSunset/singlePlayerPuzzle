const { GoogleAuth } = require('google-auth-library');
const { Translate } = require('@google-cloud/translate').v2;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, source = 'en', target = 'es' } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    // Initialize Google Translate client
    const translate = new Translate({
      key: process.env.GOOGLE_API_KEY
    });

    // Translate the text
    const [translation] = await translate.translate(text, {
      from: source,
      to: target
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        translatedText: translation,
        source: source,
        target: target
      })
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Translation failed',
        details: error.message
      })
    };
  }
};
