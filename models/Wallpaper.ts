import mongoose, { Document, Schema } from 'mongoose';

export interface IWallpaper extends Document {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  contentType: string;
  resolution?: string;
  category: string;
  downloads: number;
  likes: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WallpaperSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    contentType: { type: String, required: true },
    resolution: { type: String },
    category: { type: String, default: 'Free Fire' },
    downloads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Apply pattern to prevent OverwriteModelError
const Wallpaper = mongoose.models.Wallpaper || mongoose.model<IWallpaper>('Wallpaper', WallpaperSchema);
export default Wallpaper; 