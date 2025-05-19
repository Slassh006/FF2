import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

let gfs: Grid.Grid;
let bucket: mongoose.mongo.GridFSBucket;

// This assumes you have a mongoose connection established elsewhere
// Call this function after mongoose connection is ready
export const initializeGridFS = () => {
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    console.error("Mongoose connection not ready for GridFS initialization.");
    // Potentially retry or handle error appropriately
    return;
  }
  const conn = mongoose.connection;
  // Deprecated gridfs-stream way (might still work)
  // gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection('uploads'); // Set the collection name

  // Check if conn.db is defined before using it
  if (!conn.db) {
    console.error("Database instance (conn.db) is not available for GridFS initialization.");
    return;
  }

  // Recommended GridFSBucket way
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads' // Ensure this matches your storage engine config
  });
  console.log('GridFS Initialized');
};

// export const getGfs = () => {
//   if (!gfs) throw new Error("GridFS Stream (gfs) not initialized.");
//   return gfs;
// }

export const getBucket = () => {
  if (!bucket) {
      // Attempt initialization if not ready - might be needed in serverless envs
      initializeGridFS();
      if (!bucket) throw new Error("GridFS Bucket not initialized.");
  }
  return bucket;
};

// Helper to upload a file to GridFS
export const uploadFile = (buffer: Buffer, filename: string, contentType: string): Promise<{ fileId: mongoose.Types.ObjectId, filename: string }> => {
  return new Promise((resolve, reject) => {
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentType,
      // You can add metadata here if needed, e.g., metadata: { uploadedBy: 'userId' }
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload stream error:', error);
      reject(error);
    });

    uploadStream.on('finish', (file) => {
      if (!file || !file._id) {
        console.error('GridFS upload finished but file or file._id is undefined.');
        return reject(new Error('GridFS upload failed: No file ID returned.'));
      }
      console.log(`File uploaded to GridFS: ${file.filename}, ID: ${file._id}`);
      resolve({ fileId: file._id, filename: file.filename });
    });

    uploadStream.end(buffer);
  });
};

// Helper to delete GridFS file by ID
export const deleteFile = async (id: mongoose.Types.ObjectId): Promise<void> => {
   if (!id) throw new Error("Invalid GridFS ID for deletion");
   const gridFsBucket = getBucket();
   try {
       await gridFsBucket.delete(id);
       console.log(`GridFS file deleted: ${id}`);
   } catch (error: any) {
       // Handle case where file might not exist (e.g., already deleted)
       if (error.message.includes('FileNotFound')) {
           console.warn(`GridFS file not found during deletion (may be already deleted): ${id}`);
       } else {
           console.error(`Error deleting GridFS file ${id}:`, error);
           throw error; // Re-throw other errors
       }
   }
}; 