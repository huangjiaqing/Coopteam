import { Store } from 'ctx';
import api from 'services/stage';

export default class StageStore extends Store {

  state = {
    stages: [],
    isLoadingStages: false,
  }

  async getStages(_projectId) {
    this.setState({isLoadingStages: true});
    const res = await api.getStages(_projectId);
    this.setState({
      stages: res.data,
      isLoadingStages: false
    });
  }

  
}