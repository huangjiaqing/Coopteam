import { Store } from 'ctx';
import api from 'services/org';

export default class OrgStore extends Store {

  state = {
    isShowProjectSet: false,
    orgs: [],
    currentOrg: null,
  }

  async getOrgs() {
    const { _userId } = window.localStorage;
    const res = await api.getOrgs(_userId);
    this.setState({
      orgs: res.data
    });
  }

  setCurrentOrg(org) {
    this.setState({
      currentOrg: org
    });
  }
}