# Troubleshooting Guide

## Blank Screen on App Start

### Issue
The app shows a blank screen or "Loading..." indefinitely when started.

### Root Cause
The mobile app cannot connect to the backend API. By default, it tries to connect to `192.168.1.100:3000`.

### Solution

#### Step 1: Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend should run on `http://localhost:3000`

#### Step 2: Find Your Machine's IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your network adapter (e.g., 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
```
Look for inet address

#### Step 3: Update API Configuration
Edit `src/config.ts` and replace the IP address:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_MACHINE_IP:3000/api',
};
```

Example: `http://192.168.1.100:3000/api`

#### Step 4: Restart the App
```bash
npm start
```

### Testing Connection

If the app still shows an error, verify the backend is accessible:

```bash
# From your machine
curl http://localhost:3000/api/vehicles

# From mobile device/simulator (replace IP with your machine's IP)
curl http://192.168.1.100:3000/api/vehicles
```

### Platform-Specific Notes

**Android Emulator:**
- Use `10.0.2.2` instead of `localhost` or your machine IP
- Update config: `BASE_URL: 'http://10.0.2.2:3000/api'`

**iOS Simulator:**
- Use `localhost` or your machine IP
- Update config: `BASE_URL: 'http://localhost:3000/api'`

**Physical Device:**
- Use your machine's local network IP (e.g., 192.168.x.x)
- Ensure device is on same WiFi network as backend
- Update config: `BASE_URL: 'http://192.168.x.x:3000/api'`

### Verify Backend is Running

Check if backend is accessible:
```bash
curl http://localhost:3000/health
```

Should return: `{"status":"ok"}`

### Common Errors

**"Failed to connect to backend"**
- Backend is not running
- Wrong IP address in config
- Firewall blocking port 3000
- Device not on same network

**"Network timeout"**
- Backend is slow to respond
- Network connectivity issue
- Firewall blocking requests

### Debug Mode

Check console logs in Expo:
```bash
npm start
# Press 'j' for logs
```

Look for API error messages to diagnose connection issues.
