import rq from 'rq';

export default {

  async getStages(_projectId) {
    return (
      await rq.get('/api/v0/stage', {_projectId})
    );
  }
};