import rq from 'rq';

export default {

  async getProjects(_organizationId, _userId) {
    return (
      await rq.get('/api/v0/project/all', {
        _organizationId,
        _userId
      })
    );
  },

  
};