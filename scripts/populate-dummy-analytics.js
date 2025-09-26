import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate dummy analytics data
function generateDummyData() {
  const now = new Date();
  const dailyStats = {};
  const monthlyStats = {};
  const hourlyStats = {};
  const countryStats = {};
  const browserStats = {};

  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random visitors per day (50-500)
    const dailyVisitors = Math.floor(Math.random() * 450) + 50;
    const newVisitors = Math.floor(dailyVisitors * (0.3 + Math.random() * 0.4)); // 30-70% new
    const returningVisitors = dailyVisitors - newVisitors;
    const pageViews = Math.floor(dailyVisitors * (1.5 + Math.random() * 1.5)); // 1.5-3 pages per visitor

    dailyStats[dateStr] = {
      visitors: dailyVisitors,
      pageViews: pageViews,
      sessions: dailyVisitors,
      newVisitors: newVisitors,
      returningVisitors: returningVisitors,
    };
  }

  // Generate last 6 months of data
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - i);
    const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;

    // Aggregate daily data for the month
    const monthData = Object.entries(dailyStats)
      .filter(([date]) => date.startsWith(monthStr))
      .reduce(
        (acc, [, data]) => ({
          visitors: acc.visitors + data.visitors,
          pageViews: acc.pageViews + data.pageViews,
          sessions: acc.sessions + data.sessions,
          newVisitors: acc.newVisitors + data.newVisitors,
          returningVisitors: acc.returningVisitors + data.returningVisitors,
        }),
        {
          visitors: 0,
          pageViews: 0,
          sessions: 0,
          newVisitors: 0,
          returningVisitors: 0,
        }
      );

    monthlyStats[monthStr] = monthData;
  }

  // Generate hourly data (0-23 hours)
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = String(hour).padStart(2, '0');
    // Peak hours: 9-11 AM, 2-4 PM, 7-9 PM
    let visitors = Math.floor(Math.random() * 20) + 5; // Base 5-25 visitors per hour

    if (
      (hour >= 9 && hour <= 11) ||
      (hour >= 14 && hour <= 16) ||
      (hour >= 19 && hour <= 21)
    ) {
      visitors = Math.floor(Math.random() * 50) + 30; // Peak: 30-80 visitors
    } else if (hour >= 22 || hour <= 6) {
      visitors = Math.floor(Math.random() * 10) + 1; // Night: 1-11 visitors
    }

    hourlyStats[hourStr] = visitors;
  }

  // Generate country data
  const countries = [
    'Egypt',
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Canada',
    'Australia',
    'Italy',
    'Spain',
    'Netherlands',
    'Sweden',
    'Norway',
    'Japan',
    'South Korea',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'Saudi Arabia',
    'UAE',
    'Turkey',
    'Russia',
    'South Africa',
  ];

  countries.forEach(country => {
    countryStats[country] = Math.floor(Math.random() * 200) + 10;
  });

  // Generate browser data
  browserStats['Chrome'] = Math.floor(Math.random() * 1000) + 500;
  browserStats['Firefox'] = Math.floor(Math.random() * 300) + 100;
  browserStats['Safari'] = Math.floor(Math.random() * 400) + 150;
  browserStats['Edge'] = Math.floor(Math.random() * 200) + 50;
  browserStats['Opera'] = Math.floor(Math.random() * 100) + 20;
  browserStats['Other'] = Math.floor(Math.random() * 50) + 10;

  // Calculate totals
  const totalVisitors = Object.values(dailyStats).reduce(
    (sum, day) => sum + day.visitors,
    0
  );
  const totalNewVisitors = Object.values(dailyStats).reduce(
    (sum, day) => sum + day.newVisitors,
    0
  );
  const totalReturningVisitors = Object.values(dailyStats).reduce(
    (sum, day) => sum + day.returningVisitors,
    0
  );

  // Device stats (realistic distribution)
  const deviceStats = {
    desktop: Math.floor(totalVisitors * 0.45), // 45% desktop
    mobile: Math.floor(totalVisitors * 0.5), // 50% mobile
    tablet: Math.floor(totalVisitors * 0.05), // 5% tablet
  };

  return {
    counter: totalVisitors,
    newVisitors: totalNewVisitors,
    returningVisitors: totalReturningVisitors,
    lastVisit: now.toISOString(),
    dailyStats,
    monthlyStats,
    hourlyStats,
    deviceStats,
    browserStats,
    countryStats,
  };
}

async function populateDummyData() {
  try {
    console.log('🚀 Starting to populate dummy analytics data...');

    // Check if config already exists
    const existingConfig = await prisma.config.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existingConfig) {
      console.log('⚠️  Config already exists. Updating with dummy data...');

      // Update existing config
      const dummyData = generateDummyData();
      await prisma.config.update({
        where: { id: existingConfig.id },
        data: {
          config: {
            globalConfig: dummyData,
          },
        },
      });

      console.log('✅ Updated existing config with dummy data');
    } else {
      console.log('📝 Creating new config with dummy data...');

      // Create new config
      const dummyData = generateDummyData();
      await prisma.config.create({
        data: {
          config: {
            globalConfig: dummyData,
          },
        },
      });

      console.log('✅ Created new config with dummy data');
    }

    // Display summary
    const dummyData = generateDummyData();
    console.log('\n📊 Dummy Data Summary:');
    console.log(`   Total Visitors: ${dummyData.counter.toLocaleString()}`);
    console.log(`   New Visitors: ${dummyData.newVisitors.toLocaleString()}`);
    console.log(
      `   Returning Visitors: ${dummyData.returningVisitors.toLocaleString()}`
    );
    console.log(
      `   Device Stats: Desktop(${dummyData.deviceStats.desktop}), Mobile(${dummyData.deviceStats.mobile}), Tablet(${dummyData.deviceStats.tablet})`
    );
    console.log(
      `   Countries: ${Object.keys(dummyData.countryStats).length} countries`
    );
    console.log(
      `   Browsers: ${Object.keys(dummyData.browserStats).length} browsers`
    );
    console.log(
      `   Daily Data: ${Object.keys(dummyData.dailyStats).length} days`
    );
    console.log(
      `   Monthly Data: ${Object.keys(dummyData.monthlyStats).length} months`
    );
    console.log(
      `   Hourly Data: ${Object.keys(dummyData.hourlyStats).length} hours`
    );

    console.log('\n🎉 Dummy analytics data populated successfully!');
    console.log(
      '💡 You can now view the analytics dashboard with realistic data.'
    );
    console.log('🔄 To reset for production, run: npm run reset-analytics');
  } catch (error) {
    console.error('❌ Error populating dummy data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateDummyData();
