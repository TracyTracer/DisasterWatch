const admin = require('firebase-admin');

// 🔑 Replace with your Firebase project's service account key JSON file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminRole() {
  try {
    const user = await admin.auth().getUserByEmail('james@gmail.com');
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin role set for ${user.email}`);
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
  }
}

setAdminRole();
