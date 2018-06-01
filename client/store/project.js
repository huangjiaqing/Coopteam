import { Store } from 'ctx';
import api from 'services/project';

export default class ProjectStore extends Store {

  state = {
    projects: [], // 当前组织下的所有项目
  }

  async getProjects(_organizationId_) {
    const { _userId } = window.localStorage;
    const res = await api.getProjects(_organizationId_, _userId);
    this.setState({
      projects: res.data
    });
  }
}