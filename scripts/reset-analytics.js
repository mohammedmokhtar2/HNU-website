const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAnalytics() {
    try {
        console.log('🔄 Starting to reset analytics data...');

        // Delete all config records
        const deletedConfigs = await prisma.config.deleteMany({});

        console.log(`✅ Deleted ${deletedConfigs.count} config record(s)`);

        // Create a fresh, empty config
        const freshConfig = {
            counter: 0,
            newVisitors: 0,
            returningVisitors: 0,
            lastVisit: new Date().toISOString(),
            dailyStats: {},
            monthlyStats: {},
            hourlyStats: {},
            deviceStats: {
                desktop: 0,
                mobile: 0,
                tablet: 0,
            },
            browserStats: {},
            countryStats: {},
        };

        await prisma.config.create({
            data: {
                config: {
                    globalConfig: freshConfig,
                },
            },
        });

        console.log('✅ Created fresh, empty config');
        console.log('\n🎉 Analytics data reset successfully!');
        console.log('🚀 Ready for production - analytics will start tracking real visitors.');

    } catch (error) {
        console.error('❌ Error resetting analytics data:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
resetAnalytics();
