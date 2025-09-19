// scripts/migrateRegistrations.js
import mongoose from 'mongoose';
import PropertyRegistration from '../models/PropertyRegistration.js';

const migrateRegistrations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Add missing fields to existing registrations
    const result = await PropertyRegistration.updateMany(
      {},
      {
        $set: {
          reviewedBy: null,
          reviewedAt: null,
          approvedAt: null,
          rejectedAt: null,
          adminNotes: null
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} registrations`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateRegistrations();