import mongoose from 'mongoose';
import R from 'ramda';

const Project = mongoose.model('Project');

export default {

  /**
 * 获取某个企业下，我参与的所有项目
 * @param {string} _organizationId 
 * @param {string} _userId 
 */
  async getProjects(_organizationId, _userId) {
    let projects = [];
    let projectsForOrgId = await Project.find({
      _organizationId
    });
    if (!projectsForOrgId.length) {
      return [];
    }
    for (let project of projectsForOrgId) {
      for (let memberId of project.members) {
        if (R.equals(memberId.toString(), _userId)) {
          projects.push(project);
          break;
        }
      }
    }
    return projects;
  },

  /**
   * 获取项目
   * @param {string} _projectId 
   */
  async getProjectInfo(_projectId) {
    return await Project.findOne({
      _projectId
    });
  },

  /**
   * 创建项目
   * @param {object} info 
   */
  async createProject(info) {
    const project = new Project({
      ...info,
      _projectId: mongoose.Types.ObjectId(),
      members: [info._createId],
    });

    return await project.save();    
  },

  /**
   * 更新项目
   * @param {string} _projectId 
   * @param {object} data 
   */
  async updateProject(_projectId, data) {
    const project = await Project.findOneAndUpdate({
      _projectId
    }, data);

    return project;
  },

  /**
   * 删除项目
   * @param {string} _projectId 
   */
  async removeProject(_projectId) {
    return await Project.findOneAndRemove({
      _projectId
    });
  }
};