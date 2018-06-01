import mongoose from 'mongoose';
import glob from 'glob';
import { resolve } from 'path';

const db = 'mongodb://127.0.0.1:27017/coopteam';

mongoose.Promise = global.Promise;

export const connect = () => {
  let maxConnectTimes = 0;

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }

    mongoose.connect(db);

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++;

      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error('[mongoose log] Error connecting to: ' + db);
      }
    });

    mongoose.connection.on('error', err => {
      maxConnectTimes++;

      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error('[mongoose log] Error connecting to: ' + db + ' & error: ' + err);
      }
    });

    mongoose.connection.once('open', () => {
      console.log('MongoDB Connected successfully!')
      resolve();
    });
  });
};

export const initSchemas = () => {
  glob.sync(resolve(__dirname, './schemas', '**/*.js')).forEach(require);
};

export const initAdmin = async () => {
  const User = mongoose.model('User');
  const res = await User.find();

  if (res.length > 0) {
    return {
      message: '已经有用户啦',
      data: res
    };
  }

  const data = [
    '黄嘉庆',
    '老王',
    '戴思泰',
    '张继科',
  ].map((item, idx) => ({
    name: item,
    email: `test${idx+1}@zz.com`,
    password: '123456',
    _userId: new mongoose.Types.ObjectId
  }));

  try {
    await User.insertMany(data);
    return data;
  } catch(e) {
    console.log(e)
  }
};