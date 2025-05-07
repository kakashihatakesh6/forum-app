// Script to push Prisma schema to the database

const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Pushing Prisma schema to the database...');
  
  // Get the absolute path to the Prisma schema file
  const prismaSchemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
  
  // Run prisma db push with the provided schema path
  execSync(`npx prisma db push --schema=${prismaSchemaPath}`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: "mongodb+srv://username:password@clustername.mongodb.net/forum-app?retryWrites=true&w=majority"
    }
  });
  
  console.log('Database schema updated successfully!');
} catch (error) {
  console.error('Error pushing schema to database:', error.message);
  process.exit(1);
} 