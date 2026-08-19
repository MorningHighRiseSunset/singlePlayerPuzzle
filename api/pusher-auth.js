// Pusher authentication endpoint for presence channels
// This allows client events on presence channels without needing a backend database

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body);
      const { socket_id, channel_name } = body;

      console.log('Pusher auth request:', { socket_id, channel_name });

      // For this simple game, we'll allow all presence channel subscriptions
      const auth = {
        auth: socket_id,
        channel_data: {
          user_id: socket_id,
          user_info: {
            name: 'Player ' + socket_id.substring(0, 8)
          }
        }
      };

      console.log('Pusher auth response:', auth);
      return res.status(200).json(auth);
    } catch (e) {
      console.log('Error parsing request body:', e);
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
