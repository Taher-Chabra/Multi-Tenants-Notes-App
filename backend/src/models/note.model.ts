import mongoose from "mongoose";

interface NoteDocument extends mongoose.Document {
   _id: mongoose.Types.ObjectId;
   title: string;
   content: string;
   tenantId: mongoose.Types.ObjectId;
   ownerId: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const noteSchema = new mongoose.Schema<NoteDocument>({
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