import { controller, get, post, del, put, required } from '../lib/decorator';
import Project from '../service/project';

@controller('/api/v0/project')
export class ProjectController {

  @get('/')
  @required({
    query: ['_projectId']
  })
  async getProjectInfo(ctx) {
    const { _projectId } = ctx.query;
    const res = await Project.getProjectInfo(_projectId);
    return (ctx.body = res);
  }

  @get('/all')
  @required({
    query: ['_organizationId', '_userId']
  })
  async getProjects(ctx) {
    const { _organizationId, _userId } = ctx.query;
    const res = await Project.getProjects(_organizationId, _userId);
    return (ctx.body = res);
  }

  @post('/create')
  @required({
    body: [
      'name',
      '_createId',
      '_organizationId'
    ]
  })
  async create(ctx) {
    const {
      name,
      _createId,
      _organizationId,
      description='',
      logo='',
    } = ctx.request.body;
    const res = await Project.createProject({
      name,
      _createId,
      _organizationId,
      description,
      logo
    });
    return (ctx.body = res);
  }

  @put('/update/:_projectId')
  async update(ctx) {
    const { _projectId } = ctx.params;
    const data = ctx.request.body;
    const res = await Project.updateProject(_projectId, data);
    
    return (ctx.body = res);
  }

  @del('/remove')
  @required({
    query: ['_projectId']
  })
  async remove(ctx) {
    const { _projectId } = ctx.query;
    const res = await Project.removeProject(_projectId);

    return (ctx.body = res);
  }
}