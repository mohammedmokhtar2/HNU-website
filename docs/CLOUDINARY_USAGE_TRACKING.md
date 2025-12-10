# Cloudinary Usage Tracking System

A comprehensive system to track and monitor your Cloudinary usage, credits, and limits in real-time.

## 🎯 Overview

This system provides real-time monitoring of your Cloudinary account usage, helping you stay within your monthly limits and avoid unexpected charges. Perfect for managing your 25 credits/month free tier.

## 📊 Features

### Real-Time Usage Monitoring
- **Credits Tracking**: Monitor your monthly credit usage (25 credits/month for free tier)
- **Storage Monitoring**: Track storage usage and limits
- **Bandwidth Tracking**: Monitor bandwidth consumption
- **Transformation Limits**: Track image/video transformation usage
- **API Request Limits**: Monitor API request consumption

### Visual Indicators
- **Color-Coded Status**: Green (Good), Yellow (Warning), Red (Critical)
- **Progress Bars**: Visual representation of usage percentages
- **Real-Time Updates**: Live data refresh capabilities
- **Warning Alerts**: Notifications when approaching limits

## 🔧 API Endpoints

### Usage Statistics API
**GET** `/api/files/usage`

Fetches real-time usage data from Cloudinary.

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": {
      "used": 15,
      "limit": 25,
      "remaining": 10,
      "percentage": 60
    },
    "storage": {
      "used": 1073741824,
      "limit": 10737418240,
      "remaining": 9663676416,
      "percentage": 10
    },
    "transformations": {
      "used": 1000,
      "limit": 10000,
      "remaining": 9000,
      "percentage": 10
    },
    "bandwidth": {
      "used": 5368709120,
      "limit": 10737418240,
      "remaining": 5368709120,
      "percentage": 50
    },
    "requests": {
      "used": 5000,
      "limit": 50000,
      "remaining": 45000,
      "percentage": 10
    }
  }
}
```

## 🎨 UI Components

### Statistics Cards
Real-time usage statistics displayed in the admin panel:

```tsx
// Credits Usage Card
<Card>
  <CardHeader>
    <CardTitle>Credits Used</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      {usage ? `${formatNumber(usage.credits.used)} / ${formatNumber(usage.credits.limit)}` : 'Loading...'}
    </div>
    <p className={`text-xs ${getUsageStatusColor(usage.credits.percentage)}`}>
      {usage ? `${usage.credits.percentage}% used` : 'Fetching data...'}
    </p>
  </CardContent>
</Card>
```

### Usage Overview Panel
Comprehensive usage tracking with visual progress bars:

```tsx
// Credits Progress Bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className={`h-2 rounded-full transition-all duration-300 ${
      usage.credits.percentage >= 90 ? 'bg-red-500' :
      usage.credits.percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
    }`}
    style={{ width: `${Math.min(usage.credits.percentage, 100)}%` }}
  />
</div>
```

## 🚀 Usage

### React Hook
```tsx
import { useCloudinaryUsage } from '@/hooks/use-cloudinary-usage';

function MyComponent() {
  const { usage, isLoading, error, refreshUsage, lastUpdated } = useCloudinaryUsage();

  if (isLoading) return <div>Loading usage data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Credits: {usage?.credits.used} / {usage?.credits.limit}</h3>
      <p>Status: {getUsageStatus(usage?.credits.percentage || 0)}</p>
      <button onClick={refreshUsage}>Refresh</button>
    </div>
  );
}
```

### Helper Functions
```tsx
import { 
  formatBytes, 
  formatNumber, 
  getUsageStatusColor, 
  getUsageStatus 
} from '@/hooks/use-cloudinary-usage';

// Format file sizes
const size = formatBytes(1073741824); // "1 GB"

// Format numbers with commas
const count = formatNumber(12345); // "12,345"

// Get status color
const color = getUsageStatusColor(85); // "text-yellow-600"

// Get status text
const status = getUsageStatus(85); // "Warning"
```

## 📈 Monitoring Features

### Status Levels
- **Good (0-74%)**: Green indicators, normal usage
- **Warning (75-89%)**: Yellow indicators, approaching limits
- **Critical (90%+)**: Red indicators, immediate attention needed

### Automatic Alerts
- **Warning Alert**: Shows when usage exceeds 75%
- **Critical Alert**: Shows when usage exceeds 90%
- **Upgrade Suggestion**: Recommends plan upgrade when needed

### Real-Time Updates
- **Auto Refresh**: Data updates automatically
- **Manual Refresh**: Manual refresh button available
- **Last Updated**: Shows when data was last refreshed

## 🔍 Cloudinary Plan Information

### Free Tier (25 Credits/Month)
- **Credits**: 25 per month
- **Storage**: 10 GB
- **Bandwidth**: 10 GB
- **Transformations**: 10,000 per month
- **API Requests**: 50,000 per month

### Usage Calculation
- **Upload**: 1 credit per 1,000 images
- **Transformations**: 1 credit per 1,000 transformations
- **Bandwidth**: 1 credit per 1 GB bandwidth
- **Storage**: 1 credit per 1 GB storage per month

## 🛠️ Configuration

### Environment Variables
```env
# Required for usage tracking
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### API Rate Limits
- **Usage API**: No rate limits (cached data)
- **Refresh Interval**: Recommended every 5-10 minutes
- **Real-time Updates**: Available on demand

## 📱 Responsive Design

### Mobile Optimization
- **Responsive Cards**: Adapt to different screen sizes
- **Touch-Friendly**: Easy to use on mobile devices
- **Compact View**: Optimized for small screens

### Desktop Features
- **Detailed View**: Full usage statistics
- **Multiple Charts**: Visual representation of all metrics
- **Export Options**: Data export capabilities

## 🔒 Security

### Data Protection
- **Server-Side Only**: Usage data fetched server-side
- **No Sensitive Data**: Only usage statistics exposed
- **Secure API**: Protected by authentication

### Error Handling
- **Graceful Degradation**: Shows fallback data on errors
- **User-Friendly Messages**: Clear error descriptions
- **Retry Mechanisms**: Automatic retry on failures

## 📊 Analytics Dashboard

### Usage Trends
- **Daily Usage**: Track daily consumption
- **Weekly Patterns**: Identify usage patterns
- **Monthly Projections**: Predict monthly usage

### Cost Optimization
- **Usage Recommendations**: Tips to reduce usage
- **Plan Suggestions**: Recommendations for plan upgrades
- **Efficiency Tips**: Ways to optimize Cloudinary usage

## 🚨 Alerts & Notifications

### Warning System
```tsx
{usage.credits.percentage >= 75 && (
  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
    ⚠️ You're using {usage.credits.percentage}% of your monthly credits. 
    Consider upgrading your plan if you need more resources.
  </div>
)}
```

### Status Indicators
- **Green**: Safe usage levels
- **Yellow**: Warning - approaching limits
- **Red**: Critical - immediate action needed

## 🔄 Maintenance

### Regular Tasks
- **Monitor Usage**: Check usage regularly
- **Optimize Images**: Use appropriate formats and sizes
- **Clean Up**: Remove unused files
- **Review Limits**: Adjust usage patterns as needed

### Best Practices
- **Compress Images**: Use appropriate compression
- **Optimize Transformations**: Minimize unnecessary transformations
- **Monitor Bandwidth**: Track bandwidth usage
- **Plan Ahead**: Monitor trends and plan accordingly

## 📚 API Reference

### Cloudinary Usage API
```typescript
// Get usage data
const response = await fetch('/api/files/usage');
const data = await response.json();

// Usage data structure
interface CloudinaryUsage {
  credits: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  storage: {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
  };
  // ... other metrics
}
```

### React Hook API
```typescript
interface UseCloudinaryUsageReturn {
  usage: CloudinaryUsage | null;
  isLoading: boolean;
  error: string | null;
  refreshUsage: () => Promise<void>;
  lastUpdated: Date | null;
}
```

## 🎉 Getting Started

1. **Configure Cloudinary**: Set up your environment variables
2. **Access Admin Panel**: Navigate to `/admin/system/storage`
3. **View Usage**: Check the Analytics tab for usage statistics
4. **Monitor Limits**: Keep track of your 25 credits/month
5. **Set Alerts**: Configure notifications for usage warnings

The Cloudinary usage tracking system is now fully integrated and ready to help you manage your monthly credits and limits effectively!
