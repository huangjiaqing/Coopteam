import { controller, get, post, put, del, required } from '../lib/decorator';
import Stage from '../service/stage';
import R from 'ramda';

@controller('/api/v0/stage')
export class StageController {

  @get('/')
  @required({
    query: ['_projectId']
  })
  async getStages(ctx) {
    const { _projectId } = ctx.query;
    const res = await Stage.getStages(_projectId);
    return (ctx.body = res);
  }

  @post('/create')
  @required({
    body: ['name', '_projectId', '_createId']
  })
  async create(ctx) {
    const data = ctx.request.body;
    const res = await Stage.createStage(data);
    return (ctx.body = res);
  }

  @post('/move')
  @required({
    body: ['_projectId', '_stageId', 'order', ]
  })
  async move(ctx) {
    const data = ctx.request.body;
    try {
      await Stage.moveStage(data);
      return (ctx.body = {
        success: true,
        message: '移动列表成功'
      });
    } catch(e) {
      return (ctx.body = {
        success: false,
        err: '无法移动列表'
      });
    }
  }

  @del('/remove/:_stageId')
  async remove(ctx) {
    const { _stageId } = ctx.params;
    const res = await Stage.removeStage(_stageId);
    return (ctx.body = res);
  }

  @put('/update/:_stageId')
  @required({
    body: ['name']
  })
  async update(ctx) {
    const { _stageId } = ctx.params;
    const { name } = ctx.request.body;
    if (!(R.is(String, name) && name.length)) {
      return (ctx.body = {
        success: false,
        err: 'name参数不正确'
      });
    }
    const res = await Stage.updateStage(_stageId, name);
    return (ctx.body = res);
  }
}