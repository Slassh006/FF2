const fs = require('fs');
if (!fs.existsSync('.env.production')) {
  console.error('\n[ERROR] .env.production file is missing! Please create it before starting the app.\n');
  process.exit(1);
} else {
  console.log('[INFO] .env.production file found.');
} 