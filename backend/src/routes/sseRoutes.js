import express from 'express';

const router = express.Router();

// Store active connected clients
const clients = new Set();

/**
 * Broadcast an event to all connected SSE clients
 * @param {string} event - Event name, e.g. 'crowd_update', 'new_alert'
 * @param {object} data - Payload data
 */
export function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

/**
 * GET /api/v1/stream
 * Public or admin real-time SSE stream
 */
router.get('/', (req, res) => {
  // Set SSE response headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx)
  res.flushHeaders();

  // Add client to active listeners
  clients.add(res);

  // Send initial handshake event
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to Divya Setu Live Stream', timestamp: new Date() })}\n\n`);

  // Heartbeat ping every 25 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
});

export const sseRouter = router;
export default router;
