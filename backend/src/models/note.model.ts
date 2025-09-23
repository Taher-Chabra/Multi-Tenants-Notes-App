import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },
   content: {
      type: String,
      required: true,
      trim: true
   },
   tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true
   },
   ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);