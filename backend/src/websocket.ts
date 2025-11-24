import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface LocationUpdate {
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const clients = new Map<string, Set<WebSocket>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        
        if (message.type === 'subscribe') {
          const tripId = message.tripId;
          if (!clients.has(tripId)) {
            clients.set(tripId, new Set());
          }
          clients.get(tripId)!.add(ws);
        } else if (message.type === 'location') {
          const update: LocationUpdate = {
            tripId: message.tripId,
            latitude: message.latitude,
            longitude: message.longitude,
            timestamp: new Date().toISOString()
          };
          broadcastLocation(update);
        }
      } catch (err) {
        console.error('WebSocket error:', err);
      }
    });

    ws.on('close', () => {
      clients.forEach((set) => set.delete(ws));
    });
  });
}

export function broadcastLocation(update: LocationUpdate) {
  const subscribers = clients.get(update.tripId);
  if (subscribers) {
    const message = JSON.stringify(update);
    subscribers.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}
