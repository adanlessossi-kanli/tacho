# Fleet Management System - Quick Reference Card

## 🚀 Start Here

### 1. Install & Run (3 Commands)
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Web Dashboard
cd web-dashboard && npm install && npm start

# Terminal 3: Mobile App
npm install && npm start
```

### 2. Test Immediately
```bash
# Register vehicle
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Truck 001","licensePlate":"ABC-1234"}'

# Open dashboard
# http://localhost:3000
```

---

## 📍 Key URLs

| Component | URL | Port |
|-----------|-----|------|
| Backend API | http://localhost:3000 | 3000 |
| Web Dashboard | http://localhost:3000 | 3000 (React dev) |
| Mobile App | Expo | 19000+ |
| WebSocket | ws://localhost:3000 | 3000 |

---

## 🔌 Essential API Endpoints

### Quick Reference
```bash
# Vehicles
POST   /api/vehicles              # Register
GET    /api/vehicles              # List
GET    /api/vehicles/:id          # Get one

# Drivers
POST   /api/drivers               # Register
GET    /api/drivers               # List

# Routes
POST   /api/routes                # Create
GET    /api/routes                # List
GET    /api/routes/:id/stops      # Get stops

# Trips
POST   /api/trips                 # Create
GET    /api/trips                 # List
GET    /api/trips/:id             # Get one
PUT    /api/trips/:id/end         # End trip

# GPS
POST   /api/gps                   # Record location
GET    /api/gps/:tripId           # Get history

# Health
GET    /health                    # Check status
```

---

## 📱 Mobile App Screens

| Screen | Purpose | Features |
|--------|---------|----------|
| Dashboard | Overview | Stats, quick info |
| Vehicles | Manage vehicles | Add, list vehicles |
| Drivers | Manage drivers | Add, list drivers |
| Trips | Manage trips | Create, list trips |
| Trip Execution | Execute trip | GPS tracking, stops |
| Settings | App info | Version, API URL |

---

## 🗺️ Web Dashboard

| Section | Purpose |
|---------|---------|
| Stats | Fleet statistics |
| Live Map | Real-time tracking |
| Trip List | Active trips |
| Vehicle List | All vehicles |

---

## 💾 Database Tables

```sql
vehicles          -- Fleet vehicles
drivers           -- Driver profiles
routes            -- Trip routes
stops             -- Route stops
trips             -- Trip records
gpsLocations      -- GPS tracking
```

---

## 🔧 Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development
npm run build        # Build TypeScript
npm start            # Run production
```

### Web Dashboard
```bash
cd web-dashboard
npm install          # Install dependencies
npm start            # Start development
npm run build        # Build for production
```

### Mobile App
```bash
npm install          # Install dependencies
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run on web
```

### Database
```bash
sqlite3 backend/fleet.db
SELECT * FROM vehicles;
SELECT COUNT(*) FROM gpsLocations;
```

---

## 🐳 Docker Commands

```bash
# Build and run
docker-compose up

# Build only
docker-compose build

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build
```

---

## 📊 Test Workflow

### 1. Register Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Truck 001","licensePlate":"ABC-1234"}'
```

### 2. Register Driver
```bash
curl -X POST http://localhost:3000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}'
```

### 3. Create Route
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"name":"Route A","description":"Test","stops":[{"latitude":40.7128,"longitude":-74.0060,"address":"NYC"}]}'
```

### 4. Create Trip
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":"<id>","driverId":"<id>","routeId":"<id>"}'
```

### 5. Track GPS
```bash
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d '{"tripId":"<id>","latitude":40.7128,"longitude":-74.0060}'
```

### 6. End Trip
```bash
curl -X PUT http://localhost:3000/api/trips/<id>/end
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Module not found | `rm -rf node_modules && npm install` |
| Database locked | `rm backend/fleet.db-wal backend/fleet.db-shm` |
| API not responding | Check backend is running: `curl http://localhost:3000/health` |
| WebSocket error | Check browser console, verify backend running |
| GPS not tracking | Check location permissions on mobile |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP.md | Installation guide |
| QUICKSTART.md | Quick start |
| API_EXAMPLES.md | API reference |
| DEVELOPMENT.md | Development guide |
| INDEX.md | Project index |
| MVP_SUMMARY.md | Architecture |
| COMPLETION_REPORT.md | Project report |

---

## 🎯 Features Checklist

- ✅ Vehicle registration & tracking
- ✅ Driver management
- ✅ Route & stop management
- ✅ Trip scheduling & execution
- ✅ Real-time GPS tracking
- ✅ WebSocket updates
- ✅ Mobile app
- ✅ Web dashboard
- ✅ Live map
- ✅ Fleet statistics

---

## 🔐 Security Reminders

⚠️ **Development MVP** - Add for production:
- Authentication
- Authorization
- Input validation
- HTTPS/WSS
- Rate limiting
- Data encryption
- Logging

---

## 📞 Quick Help

### Backend Issues
```bash
# Check if running
curl http://localhost:3000/health

# View logs
# Check terminal where backend started

# Restart
# Ctrl+C then npm run dev
```

### Mobile Issues
```bash
# Clear cache
expo start --clear

# Check API URL
# In environment variables

# View logs
# In Expo console
```

### Web Issues
```bash
# Check console
# F12 in browser

# Check WebSocket
# Network tab in DevTools

# Refresh
# Ctrl+R or Cmd+R
```

---

## 🚀 Deployment

### Docker
```bash
docker-compose up
```

### Manual
```bash
# Backend
cd backend && npm install && npm run build && npm start

# Web
cd web-dashboard && npm install && npm run build && npm start

# Mobile
npm install && npm start
```

---

## 📈 Performance Tips

- GPS interval: 5 seconds (configurable)
- Distance threshold: 10 meters
- Use WebSocket for real-time
- Cache API responses
- Lazy load components
- Optimize database queries

---

## 🎓 Learning Path

1. **Start:** README.md
2. **Setup:** SETUP.md
3. **Test:** QUICKSTART.md
4. **API:** API_EXAMPLES.md
5. **Code:** Explore src/
6. **Deploy:** DEVELOPMENT.md

---

## 💡 Pro Tips

- Use `jq` for JSON parsing: `curl ... | jq`
- Monitor database: `sqlite3 backend/fleet.db`
- Check WebSocket: Browser DevTools → Network
- Test API: Use Postman or curl
- Debug mobile: Expo console
- Debug web: Browser DevTools

---

## 📋 Checklist

- [ ] Backend running on 3000
- [ ] Web dashboard on 3000
- [ ] Mobile app on Expo
- [ ] Database created
- [ ] API responding
- [ ] WebSocket connected
- [ ] Map displaying
- [ ] GPS tracking working

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start with QUICKSTART.md for immediate testing.

**Happy Fleet Managing! 🚀**

---

**Last Updated:** 2024
**Version:** 1.0.0
