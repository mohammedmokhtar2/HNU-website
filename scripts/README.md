# Analytics Scripts

This directory contains scripts for managing analytics data for presentations and production.

## 📊 Populate Dummy Data

Use this script to populate the database with realistic dummy analytics data for presentations or demos.

### Usage:
```bash
npm run analytics:dummy
```

### What it does:
- Generates 30 days of realistic visitor data
- Creates 6 months of monthly statistics
- Adds hourly distribution data (24 hours)
- Populates device statistics (Desktop, Mobile, Tablet)
- Adds browser usage data (Chrome, Firefox, Safari, etc.)
- Includes geographic data for 22+ countries
- Calculates realistic visitor patterns with peak hours

### Data Generated:
- **Total Visitors**: 1,000-15,000+ visitors
- **Daily Visitors**: 50-500 visitors per day
- **Peak Hours**: 9-11 AM, 2-4 PM, 7-9 PM
- **Device Distribution**: 45% Desktop, 50% Mobile, 5% Tablet
- **Geographic Data**: 22+ countries with realistic visitor counts
- **Browser Data**: Chrome, Firefox, Safari, Edge, Opera, Other

## 🔄 Reset Analytics Data

Use this script to clear all analytics data and start fresh for production.

### Usage:
```bash
npm run analytics:reset
```

### What it does:
- Deletes all existing analytics data
- Creates a fresh, empty config
- Resets all counters to 0
- Prepares the system for real visitor tracking

## 🎯 Use Cases

### For Presentations/Demos:
1. Run `npm run analytics:dummy` to populate realistic data
2. Show the analytics dashboard with impressive charts and statistics
3. Demonstrate all features with real-looking data

### For Production:
1. Run `npm run analytics:reset` to clear dummy data
2. Deploy to production
3. Real visitors will start populating the analytics

## 📈 Data Structure

The dummy data includes:
- **Daily Stats**: Visitors, page views, sessions, new/returning visitors per day
- **Monthly Stats**: Aggregated monthly data
- **Hourly Stats**: Visitor distribution throughout the day
- **Device Stats**: Desktop, mobile, tablet breakdown
- **Browser Stats**: Browser usage statistics
- **Country Stats**: Geographic visitor distribution

## ⚠️ Important Notes

- **Backup**: Always backup your database before running these scripts
- **Production**: Never run the dummy data script in production
- **Reset**: Use the reset script before going live to ensure clean data
- **Testing**: These scripts are safe to run multiple times

## 🔧 Technical Details

- Uses Prisma ORM for database operations
- Generates realistic patterns (peak hours, device distribution)
- Maintains data consistency across all analytics dimensions
- Handles both creating new configs and updating existing ones
