# Quick Start: Using Tacho Features

## For Drivers

### Starting a Trip
1. Open mobile app
2. Go to **Trips** tab
3. Tap **+ New Trip**
4. Select vehicle and driver
5. Tap **Create Trip**

### Executing a Trip
1. From Trips list, tap the trip
2. Tap **Start Tracking** to begin GPS tracking
3. Navigate to each stop
4. Tap **Log Arrival** when you reach a stop
5. Tap **Log Departure** when leaving
6. Repeat for all stops
7. Tap **End Trip** when complete

### Monitoring GPS
- Green indicator (🔴 LIVE) = GPS tracking active
- White indicator (⚪ STOPPED) = GPS tracking stopped
- Stop tracking anytime with **Stop Tracking** button

### Viewing Stop History
- All logged stops appear in "Stop History" section
- Shows arrival and departure times
- Tracks progress (e.g., 3/5 stops completed)

---

## For Managers

### Monitoring Fleet
1. Open web dashboard
2. View **Active Vehicles**, **Total Drivers**, **Active Trips** cards
3. Click any trip in "Active Trips" list to view on map
4. Map shows GPS path and current location
5. Data refreshes automatically every 5 seconds

### Viewing Trip Details
- **Trip ID**: Unique identifier
- **Vehicle**: Which vehicle is running the trip
- **Driver**: Which driver is operating
- **Status**: Active or completed
- **Start Time**: When trip started
- **End Time**: When trip ended (if completed)
- **Distance**: Total distance traveled

### Generating Reports
1. Click **Reports** tab
2. View **Fleet Summary** with key metrics:
   - Total/Active vehicles
   - Total drivers
   - Active/Completed trips
   - Total distance
   - Average distance per trip
3. View **Trip History** table with all trip details
4. Click **📥 Export Report** to download JSON file

### Exporting Data
- Click **📥 Export Report** button
- Downloads JSON file with:
  - Fleet summary
  - All trip details
  - Timestamps
  - Distance data
- Use for analysis, billing, or record-keeping

---

## Key Metrics

### Fleet Summary
- **Active Vehicles**: Vehicles currently in use
- **Total Drivers**: All registered drivers
- **Active Trips**: Ongoing trips
- **Completed Trips**: Finished trips
- **Total Distance**: Sum of all trip distances
- **Average Distance**: Average distance per completed trip

### Trip Information
- **Status**: scheduled, active, or completed
- **Duration**: Start to end time
- **Distance**: Calculated from GPS points
- **Stops**: Number of stops on route
- **Stop Times**: Arrival and departure for each stop

---

## Tips & Best Practices

### For Drivers
- Start GPS tracking before leaving first stop
- Log arrivals and departures at each stop for accurate records
- Stop tracking when trip is complete
- Check GPS indicator to confirm tracking is active

### For Managers
- Monitor active trips in real-time
- Use reports for performance analysis
- Export data regularly for backup
- Check vehicle status to identify maintenance needs
- Review trip history for route optimization

---

## Troubleshooting

### GPS Not Tracking
- Check location permissions on mobile device
- Ensure backend is running
- Verify API connection (see TROUBLESHOOTING.md)

### Dashboard Not Updating
- Refresh page
- Check WebSocket connection
- Verify backend is running

### Missing Trip Data
- Ensure trip was ended properly
- Check backend logs for errors
- Verify database connectivity

---

## Support

For detailed setup instructions, see:
- `SETUP.md` - Installation guide
- `QUICKSTART.md` - Getting started
- `TROUBLESHOOTING.md` - Common issues
- `FEATURES.md` - Complete feature documentation
