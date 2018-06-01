import mongoose, { Schema } from 'mongoose';

const stageSchema = new Schema({
  _projectId: Schema.Types.ObjectId,
  _createId: Schema.Types.ObjectId,
  _stageId: Schema.Types.ObjectId,
  name: String,
  // 排序
  order: Number,
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

stageSchema.index({order: 1});

mongoose.model('Stage', stageSchema);