import mongoose from 'mongoose';
import R from 'ramda';

const Task = mongoose.model('Task');

export default {
  /**
   * 获取任务详情
   * @param {string} _taskId 
   */
  async getTaskInfo(_taskId) {
    return (
      Task.findOne({_taskId})
    );
  },

  /**
   * 获取某个阶段下的所有任务
   * @param {string} _stageId 
   */
  async getTasks(_stageId) {
    return (
      this.sortTasks(await Task.find({_stageId}))
    );
  },

  /**
   * 创建任务
   * @param {string} data 
   */
  async createTask(data) {
    const tasksForStage = await Task.find({
      _stageId: data._stageId
    });
    const task = new Task({
      ...data,
      order: tasksForStage.length + 1,
      _taskId: mongoose.Types.ObjectId(),
      _executorId: data._executorId ? data._executorId : data._creatorId,
    });
    return await task.save();
  },

  /**
   * 排序任务列表
   * @param {Array} tasks
   */
  sortTasks(tasks=[]) {
    return (
      R.compose(
        R.addIndex(R.map)(
          (task, idx) => {
            task.order = idx + 1;
            return task;
          }
        ),
        R.sort((a, b) => (a.order - b.order))
      )(tasks)
    );
  },

  /**
   * 排序数据库中的任务
   * @param {array} tasks
   */
  async sortTasksForDB(tasks=[]) {
    let order = 1;
    let _tasks = [];
    for (let task of tasks) {
      const res = await Task.findOneAndUpdate({
        _taskId: task._taskId
      }, { order });
      _tasks.push(res);
      order = order + 1;
    }

    return _tasks;
  },

  /**
   * 更新任务
   * @param {string} _taskId 
   * @param {string} data 
   */
  async updateTask(_taskId, data) {
    return (
      await Task.findOneAndUpdate({
        _taskId
      }, { ...data })
    );
  },

  /**
   * 删除任务
   * @param {string} _taskId 
   */
  async deleteTask(_taskId) {
    return (
      Task.findOneAndRemove({_taskId})
    );
  },

  /**
   * 移动到某个阶段
   * @param {string} _stageId 
   * @param {string} _taskId 
   */
  async intoStage(_stageId, _taskId) {
    return (
      await Task.findOneAndUpdate({
        _taskId
      }, { _stageId })
    );
  },

  /**
   * 移动任务
   * @param {object} data 
   */
  async moveTask(data) {
    const { to, _taskId, order } = data;
    try {
      const tasks = await Task.find({_stageId: to});
      const task = await this.intoStage(to, _taskId);
  
      // 更新位置
      R.compose(
        (tasks) => this.sortTasksForDB(tasks),
        (tasks) => {
          return (
            R.insert(order-1, task)(tasks)
          );
        },
        (tasks) => this.sortTasks(tasks)
      )(tasks);

      return {
        msg: '移动任务成功'
      };
    } catch (e) {
      // throw e;
      return {
        msg: '移动任务失败'
      };
    }
  }
};