import rq from 'rq';

export default {

  async getOrgs(_userId) {
    return await rq.get('/api/v0/organization', { _userId });
  },

  
};
