import mongoose from 'mongoose';

interface TenantDocument extends mongoose.Document {
   _id: mongoose.Types.ObjectId;
   name: string;
   slug?: 'acme' | 'globex';
   plan: 'free' | 'pro';
   notesUsed: number;
   lastUpdated: Date;
   isLimitReached(): boolean;
   incrementUsage(): Promise<TenantDocument>;
   decrementUsage(): Promise<TenantDocument>;
}

const tenantSchema = new mongoose.Schema<TenantDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    enum: ['acme', 'globex'],
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  notesUsed: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Check if limit is reached
tenantSchema.virtual('isLimitReached').get(function () {
  if (this.plan === 'pro') return false;
  return this.notesUsed >= 3;
});

// Increase or decrease usage count

tenantSchema.methods.incrementUsage = async function () {
  this.notesUsed += 1;
  this.lastUpdated = new Date();
  return await this.save();
};

tenantSchema.methods.decrementUsage = async function () {
  this.notesUsed = Math.max(0, this.notesUsed - 1);
  this.lastUpdated = new Date();
  return await this.save();
};

// Serialize virtual fields
tenantSchema.set('toJSON', { virtuals: true });
tenantSchema.set('toObject', { virtuals: true });

export const Tenant = mongoose.model('Tenant', tenantSchema);
