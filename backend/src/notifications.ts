export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  data?: Record<string, any>;
}

// In-memory notification queue (replace with Redis in production)
const notificationQueue: NotificationPayload[] = [];

export function sendNotification(payload: NotificationPayload): void {
  notificationQueue.push(payload);
  console.log(`[NOTIFICATION] ${payload.type.toUpperCase()}: ${payload.title} - ${payload.message}`);
}

export function sendSMS(phoneNumber: string, message: string): void {
  // Placeholder for SMS service (Twilio, AWS SNS, etc.)
  console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);
}

export function sendPushNotification(userId: string, title: string, message: string): void {
  sendNotification({
    userId,
    title,
    message,
    type: 'alert',
  });
}

export function sendGeofenceAlert(userId: string, geofenceName: string, eventType: 'enter' | 'exit'): void {
  const title = `Geofence ${eventType === 'enter' ? 'Entry' : 'Exit'}`;
  const message = `Vehicle ${eventType === 'enter' ? 'entered' : 'exited'} ${geofenceName}`;
  sendNotification({
    userId,
    title,
    message,
    type: 'alert',
    data: { geofenceName, eventType },
  });
}

export function sendTripAlert(userId: string, tripId: string, status: string): void {
  const messages: Record<string, string> = {
    started: 'Trip has started',
    completed: 'Trip has been completed',
    delayed: 'Trip is delayed',
  };
  sendNotification({
    userId,
    title: 'Trip Update',
    message: messages[status] || 'Trip status updated',
    type: 'info',
    data: { tripId, status },
  });
}

export function getNotificationQueue(): NotificationPayload[] {
  return notificationQueue;
}

export function clearNotificationQueue(): void {
  notificationQueue.length = 0;
}
