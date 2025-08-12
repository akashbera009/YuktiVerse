// import mongoose from 'mongoose';

// const sharedCodeFileSchema = new mongoose.Schema({
//   shareId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   codeFileId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'CodeFile',
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   type: {
//     type: String,  // you can store language here e.g. 'javascript'
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//     index: true
//   },
//   viewCount: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   lastViewedAt: {
//     type: Date
//   },
//   revokedAt: {
//     type: Date
//   }
// });

// // Indexes for efficient querying
// sharedCodeFileSchema.index({ shareId: 1, isActive: 1 });
// sharedCodeFileSchema.index({ userId: 1, isActive: 1 });
// sharedCodeFileSchema.index({ codeFileId: 1 });

// // Optional virtual for share URL
// sharedCodeFileSchema.virtual('shareUrl').get(function() {
//   return `${process.env.FRONTEND_URL}/api/share/codefile/${this.shareId}`;
// });

// export default mongoose.model('SharedCodeFile', sharedCodeFileSchema);
