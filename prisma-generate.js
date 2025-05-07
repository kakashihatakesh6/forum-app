// Script to generate Prisma client manually

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Generating Prisma client...');
  
  // Get the absolute path to the Prisma schema file
  const prismaSchemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
  
  // Create output directory if it doesn't exist
  const outputDir = path.resolve(__dirname, 'node_modules/.prisma/client');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Read the .env.local file to get the DATABASE_URL
  const envFilePath = path.resolve(__dirname, '.env.local');
  let databaseUrl = "mongodb+srv://username:password@clustername.mongodb.net/forum-app?retryWrites=true&w=majority";
  
  if (fs.existsSync(envFilePath)) {
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    const match = envContent.match(/DATABASE_URL="([^"]+)"/);
    if (match && match[1]) {
      databaseUrl = match[1];
    }
  }
  
  // Run prisma generate with the provided schema path and output path
  execSync(
    `npx prisma generate --schema=${prismaSchemaPath}`, 
    { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl
      }
    }
  );
  
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
} 