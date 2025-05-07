// Test Prisma MongoDB connection
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Testing Prisma MongoDB connection...');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Try to connect
    await prisma.$connect();
    console.log('Successfully connected to the database!');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`Number of users in the database: ${userCount}`);

    // Check if we can find forums
    const forums = await prisma.forum.findMany({
      take: 5,
    });
    console.log(`Found ${forums.length} forums.`);
    
    if (forums.length > 0) {
      console.log('First forum:', {
        id: forums[0].id,
        title: forums[0].title,
      });
    }

    console.log('Prisma client is working correctly!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 