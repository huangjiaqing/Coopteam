import { Store } from 'ctx';
import api from 'services/task';

export default class StageStore extends Store {

  state = {
    tasks: new Map(),
  }

  async getTasks(_stageId) {
    const res = await api.getTasks(_stageId);
    this.setState((state) => {
      state.tasks[_stageId] = res.data;
    });
  }

}