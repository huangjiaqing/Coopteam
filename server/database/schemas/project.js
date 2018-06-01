import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  name: String,
  _organizationId: Schema.Types.ObjectId,
  _projectId: Schema.Types.ObjectId,
  _createId: Schema.Types.ObjectId, 
  members: [Schema.Types.ObjectId],
  description: String,
  logo: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

mongoose.model('Project', projectSchema);