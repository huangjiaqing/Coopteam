import rq from 'rq';

export default {

  async getTasks(_stageId) {
    return (
      await rq.get('/api/v0/task/all', {_stageId})
    );
  }
};