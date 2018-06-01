import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  password: {
    type: String,
    // unique: true,
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  email: String,
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
  _userId: {
    type: Schema.Types.ObjectId,
    // unique: true
  },
});

userSchema.methods = {

  comparePassword: (_password, password) => {
    return new Promise((resolve) => {
      resolve((_password === password));
    });
  },
  
};

// userSchema.index({ email: 1 });

mongoose.model('User', userSchema);