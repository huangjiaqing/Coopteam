import fly from 'utils/request';

export default {

  async login({email, password}) {
    return (
      await fly.post('/api/v0/user/login', {
        email,
        password
      })
    );
  },

};