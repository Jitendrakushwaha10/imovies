import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri) {
      console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Connected to MongoDB successfully.');
      return;
    }
  } catch (error) {
    console.warn(`⚠️ Failed to connect to specified MONGODB_URI: ${error.message}`);
    console.log('Falling back to local in-memory MongoDB instance for seamless operation...');
  }

  // Fallback to MongoMemoryServer for instant zero-config demonstration
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`✅ Connected to Embedded In-Memory MongoDB at: ${memUri}`);
  } catch (err) {
    console.error('❌ Could not start in-memory MongoDB:', err.message);
    throw err;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
