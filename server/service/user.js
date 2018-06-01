import mongoose from 'mongoose';

const User = mongoose.model('User');

/**
 * 检查密码
 * @param {*string} email 
 * @param {*string} password 
 */
export const checkPassword = async (email, password) => {
  let match = false;
  const user = await User.findOne({ email });

  if (user) {
    match = await user.comparePassword(password, user.password);
  }

  return {
    match,
    user
  };
};