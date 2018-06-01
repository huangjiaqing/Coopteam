import { controller, get, post, required } from '../lib/decorator';
import { createOrg, getMyOrgs } from '../service/organization';

@controller('/api/v0/organization')
export class OrgController {

  @get('/')
  @required({
    query: ['_userId']
  })
  async getMyOrgs(ctx) {
    const { _userId } = ctx.query;
    const orgs = await getMyOrgs(_userId);

    ctx.body = orgs;
  }

  @post('/create')
  @required({
    body: ['name', '_createId']
  })
  async create(ctx) {
    const { name, _createId } = ctx.request.body;
    const res = await createOrg(name, _createId);

    ctx.body = res;
  }
}