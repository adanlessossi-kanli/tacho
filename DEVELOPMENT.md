# Development Guide

## Project Setup Checklist

### ✅ Initial Setup
- [x] Backend API created (Node.js/Express/TypeScript)
- [x] Mobile app created (React Native/Expo)
- [x] Web dashboard created (React)
- [x] Database schema designed (SQLite)
- [x] API endpoints implemented (18 total)
- [x] WebSocket server configured
- [x] Documentation completed

### ✅ Backend Features
- [x] Vehicle management (CRUD)
- [x] Driver management (CRUD)
- [x] Route management with stops
- [x] Trip scheduling and execution
- [x] GPS location tracking
- [x] Real-time WebSocket updates
- [x] Error handling
- [x] CORS configuration

### ✅ Mobile App Features
- [x] Bottom tab navigation
- [x] Vehicle registration screen
- [x] Driver registration screen
- [x] Trip management screen
- [x] Trip execution screen
- [x] GPS tracking service
- [x] API client service
- [x] Dashboard with statistics

### ✅ Web Dashboard Features
- [x] Live map visualization
- [x] Real-time GPS tracking
- [x] Fleet statistics
- [x] Trip monitoring
- [x] Vehicle listing
- [x] WebSocket integration
- [x] Responsive design

## Development Workflow

### 1. Local Development

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Web Dashboard:**
```bash
cd web-dashboard
npm install
npm start
```

**Terminal 3 - Mobile App:**
```bash
npm install
npm start
```

### 2. Testing

**API Testing:**
```bash
# See API_EXAMPLES.md for complete examples
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","licensePlate":"TEST-001"}'
```

**Mobile Testing:**
- Use Expo Go app on physical device
- Or use iOS/Android simulator

**Web Testing:**
- Open http://localhost:3000 in browser
- Check browser console for errors

### 3. Database Management

**View Database:**
```bash
sqlite3 backend/fleet.db
```

**Common Queries:**
```sql
-- View all vehicles
SELECT * FROM vehicles;

-- View all trips
SELECT * FROM trips;

-- View GPS history for a trip
SELECT * FROM gpsLocations WHERE tripId = 'xxx';

-- Count records
SELECT COUNT(*) FROM gpsLocations;
```

**Reset Database:**
```bash
rm backend/fleet.db
# Restart backend to recreate
```

## Code Structure

### Backend Architecture

```
backend/
├── index.ts          # Express app setup
├── database.ts       # SQLite initialization
├── routes.ts         # API endpoints
└── websocket.ts      # Real-time updates
```

**Request Flow:**
```
Client Request
    ↓
Express Middleware (CORS, JSON)
    ↓
Route Handler
    ↓
Database Query
    ↓
Response
```

### Mobile App Architecture

```
src/
├── screens/          # UI screens
├── services/         # API & GPS
├── navigation/       # Navigation setup
└── types/            # TypeScript types
```

**Data Flow:**
```
User Action
    ↓
Screen Component
    ↓
API Service
    ↓
Backend API
    ↓
Update State
    ↓
Re-render UI
```

### Web Dashboard Architecture

```
web-dashboard/src/
├── components/       # React components
├── api.ts           # API client
└── App.tsx          # Main app
```

**Real-time Flow:**
```
WebSocket Connection
    ↓
Subscribe to Trip
    ↓
Receive Location Updates
    ↓
Update Map
    ↓
Display on Dashboard
```

## Common Development Tasks

### Add New API Endpoint

1. **Add to database.ts** (if needed):
```typescript
db.run(`CREATE TABLE IF NOT EXISTS newTable (
  id TEXT PRIMARY KEY,
  ...
)`);
```

2. **Add to routes.ts**:
```typescript
router.post('/newEndpoint', (req, res) => {
  // Handle request
  res.json({ success: true });
});
```

3. **Add to mobile api.ts**:
```typescript
export const newAPI = {
  create: (data) => api.post('/newEndpoint', data),
};
```

4. **Use in mobile screen**:
```typescript
const res = await newAPI.create(data);
```

### Add New Mobile Screen

1. **Create screen file** in `src/screens/`:
```typescript
export default function NewScreen() {
  return <View>...</View>;
}
```

2. **Add to navigation** in `src/navigation/RootNavigator.tsx`:
```typescript
<Tab.Screen name="New" component={NewScreen} />
```

### Add New Dashboard Component

1. **Create component** in `web-dashboard/src/components/`:
```typescript
export default function NewComponent() {
  return <div>...</div>;
}
```

2. **Import in Dashboard.tsx**:
```typescript
import NewComponent from './NewComponent';
```

3. **Use in JSX**:
```typescript
<NewComponent />
```

## Debugging

### Backend Debugging

**Enable Verbose Logging:**
```typescript
// In index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Check Database:**
```bash
sqlite3 backend/fleet.db ".tables"
sqlite3 backend/fleet.db ".schema vehicles"
```

### Mobile Debugging

**Expo Console:**
```bash
# Press 'j' in terminal to open debugger
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

**React Native Debugger:**
```bash
# Install: npm install -g react-native-debugger
# Open: react-native-debugger
```

### Web Debugging

**Browser DevTools:**
- F12 or Cmd+Option+I
- Check Console for errors
- Check Network tab for API calls
- Check WebSocket in Network tab

## Performance Optimization

### Backend
- Add database indexes for frequently queried fields
- Implement pagination for list endpoints
- Cache frequently accessed data
- Use connection pooling

### Mobile
- Optimize GPS tracking interval
- Implement lazy loading for lists
- Cache API responses
- Minimize re-renders

### Web
- Lazy load map component
- Implement virtual scrolling for lists
- Optimize WebSocket message frequency
- Use React.memo for components

## Testing Strategy

### Unit Tests (Future)
```bash
npm test
```

### Integration Tests (Future)
```bash
# Test API endpoints
# Test database operations
# Test WebSocket communication
```

### Manual Testing Checklist

- [ ] Register vehicle
- [ ] Register driver
- [ ] Create route with stops
- [ ] Create trip
- [ ] Start GPS tracking
- [ ] View on web dashboard
- [ ] End trip
- [ ] View trip history

## Deployment Checklist

### Before Deployment
- [ ] Update version in package.json
- [ ] Review environment variables
- [ ] Test all features
- [ ] Check error handling
- [ ] Verify database migrations
- [ ] Update documentation

### Deployment Steps

**Docker:**
```bash
docker-compose build
docker-compose up -d
```

**Manual:**
```bash
# Backend
cd backend
npm install --production
npm run build
npm start

# Web Dashboard
cd web-dashboard
npm install --production
npm run build
npm start
```

## Monitoring

### Backend Monitoring
```bash
# Check server status
curl http://localhost:3000/health

# Monitor logs
tail -f backend.log

# Check database size
du -h backend/fleet.db
```

### Mobile Monitoring
- Check Expo console for errors
- Monitor network requests
- Check GPS accuracy

### Web Monitoring
- Check browser console
- Monitor WebSocket connection
- Check API response times

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Database locked:**
```bash
# Remove lock file
rm backend/fleet.db-wal
rm backend/fleet.db-shm
```

**Module not found:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Mobile Issues

**Expo connection failed:**
```bash
# Clear cache
expo start --clear
```

**API not responding:**
- Check backend is running
- Verify API URL in environment
- Check network connectivity

### Web Issues

**WebSocket connection failed:**
- Check backend WebSocket server
- Verify WS URL in environment
- Check browser console

**Map not loading:**
- Check Leaflet CSS is loaded
- Verify map container has height
- Check browser console for errors

## Version Control

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Review and merge
```

### Commit Message Format
```
[type]: [description]

Types: feat, fix, docs, style, refactor, test, chore
Example: feat: add GPS tracking to mobile app
```

## Documentation

### Update Documentation When:
- Adding new features
- Changing API endpoints
- Modifying database schema
- Updating dependencies
- Changing configuration

### Documentation Files:
- README.md - Main overview
- SETUP.md - Installation guide
- QUICKSTART.md - Quick start
- API_EXAMPLES.md - API reference
- DEVELOPMENT.md - This file

## Resources

### Official Documentation
- [Express.js](https://expressjs.com/)
- [React Native](https://reactnative.dev/)
- [React](https://react.dev/)
- [Leaflet](https://leafletjs.com/)
- [SQLite](https://www.sqlite.org/)

### Useful Tools
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Expo Go](https://expo.dev/go) - Mobile testing
- [React DevTools](https://react-devtools-tutorial.vercel.app/) - React debugging

## Next Steps

1. **Test MVP** - Follow QUICKSTART.md
2. **Customize** - Modify for your needs
3. **Add Features** - Implement from roadmap
4. **Deploy** - Use Docker or cloud
5. **Monitor** - Track performance

## Support

- Check documentation files
- Review API_EXAMPLES.md
- Check browser/console logs
- Review backend logs
- Test with curl

---

**Happy Developing! 🚀**
