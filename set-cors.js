const admin = require('firebase-admin');
const fs = require('fs');

if (!fs.existsSync('./serviceAccountKey.json')) {
  console.error('\x1b[31mError: serviceAccountKey.json not found in root directory.\x1b[0m');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json');

// Get bucket name from command line or env or fallback to project_id versions
const bucketName = process.env.BUCKET_NAME || 'thinkstack-9d003.firebasestorage.app';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setCors() {
  try {
    const bucketName = 'thinkstack-9d003.firebasestorage.app';
    console.log(`Targeting bucket: ${bucketName}...`);
    
    // Explicitly target the bucket by name
    const bucket = admin.storage().bucket(bucketName);
    
    // Check if it exists first
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error(`\x1b[31mError: Bucket "${bucketName}" was not found.\x1b[0m`);
      console.log('Please check your Firebase Console for the correct bucket name.');
      return;
    }

    const corsConfiguration = JSON.parse(fs.readFileSync('./cors.json', 'utf8'));
    await bucket.setCorsConfiguration(corsConfiguration);

    console.log(`\x1b[32m✅ CORS configuration applied successfully to ${bucketName}!\x1b[0m`);
    console.log('You should now be able to upload files without CORS issues.');
  } catch (error) {
    console.error('\x1b[31mError updating CORS:\x1b[0m', error.message);
  }
}

setCors();
