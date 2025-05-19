import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICraftlandCode extends Document {
  code: string;
  title: string;
  description: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard'; // Enforce specific values
  creatorId: Types.ObjectId; // Reference to User
  downloadCount: number;
  coverImage?: string;
  videoUrl?: string;
  features: string[];
  isVerified: boolean;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

const CraftlandCodeSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    downloadCount: { type: Number, default: 0 },
    coverImage: { type: String },
    videoUrl: { type: String },
    features: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    region: { type: String, required: true },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Apply pattern to prevent OverwriteModelError
const CraftlandCode = mongoose.models.CraftlandCode || mongoose.model<ICraftlandCode>('CraftlandCode', CraftlandCodeSchema);
export default CraftlandCode; 