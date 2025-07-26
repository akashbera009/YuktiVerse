// // models/ResourceRef.js
// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const ResourceRefSchema = new Schema({
//   kind: {
//     type: String,
//     required: true,
//     enum: ['Notebook', 'HandwrittenNote']  // which collection
//   },
//   item: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     refPath: 'chapters.$[].kind'  // points to either Notebook or HandwrittenNote
//   }
// }, { _id: false });

// export default ResourceRefSchema;
