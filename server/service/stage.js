import mongoose from 'mongoose';
import R from 'ramda';
const Stage = mongoose.model('Stage');

export default {
  /**
   * 获取某个项目下的所有阶段
   * @param {string} _projectId 
   */
  async getStages(_projectId) {
    return (
      this.sortStages(await Stage.find({ _projectId }))
    );
  },
  
  /**
   * 创建阶段
   * @param {object} data 
   */
  async createStage(data) {
    const { order=null } = data;
    const stages = this.sortStages(
      await Stage.find({
        _projectId: data._projectId
      })
    );
    const stage = {
      ...data,
      _stageId: mongoose.Types.ObjectId()
    };

    if (!order) {
      stage.order = stages.length + 1;
    } else {
      if (R.is(Number, order)) {
        for (let stage of stages) {
          if (R.gte(stage.order, order)) {
            await Stage.findOneAndUpdate({
              _stageId: stage._stageId
            }, {
              order: stage.order + 1
            });
          }
        }
      } else {
        return { msg: '创建阶段失败' };
      }
    }

    return await new Stage(stage).save();
  },

  /**
   * 排序数据库中的阶段
   * @param {Array} stages
   */
  sortStageForDB: async (stages=[]) => {
    for (let i=0; i<stages.length; i++) {
      await Stage.findOneAndUpdate({
        _stageId: stages[i]._stageId
      }, { order: i + 1 });
    }
  },

  /**
   * 对阶段数组进行排序
   * @param {Array} stages
   */
  sortStages: (stages=[]) => (
    R.compose(
      R.addIndex(R.map)(
        (stage, idx) => {
          stage.order = idx + 1;
          return stage;
        }
      ),
      R.sort((a, b)=>(a.order-b.order))
    )(stages)
  ),

  /**
   * 移动阶段
   * @param {object} data 
   */
  async moveStage(data) {
    const { order, _projectId, _stageId } = data;
    const stages = await Stage.find({ _projectId });
    R.compose(
      (stages) => this.sortStageForDB(stages),
      (stages) => {
        let isSame = (stage) => (
          R.equals(stage._stageId.toString(), _stageId)
        );
        let others = R.reject(isSame)(stages);
        let seleted = R.filter(isSame)(stages).pop();
        let _stages = R.insert(order-1, seleted)(others);
        return _stages;
      },
      (stages) => this.sortStages(stages)
    )(stages);
  },

  /**
   * 删除阶段
   * @param {string} _stageId 
   */
  async removeStage(_stageId) {
    await Stage.findOneAndRemove({_stageId});
    return { msg: '操作成功' };
  },

  /**
   * 更新阶段
   * @param {string} _stageId 
   * @param {string} name 
   */
  async updateStage(_stageId, name) {
    return await Stage.findOneAndUpdate({
      _stageId
    }, { name });
  },
};