import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      trim: true
   },
   slug: {
      type: String,
      enum: ['acme', 'globex'],
   },
   plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free'
   }
});

export const Tenant = mongoose.model('Tenant', tenantSchema);