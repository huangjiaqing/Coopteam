import mongoose from 'mongoose';

const Organization = mongoose.model('Organization');

/**
 * 创建企业
 * @param {string} name 
 * @param {objectId} _createId 
 */
export const createOrg = async (name, _createId) => {
  const org = new Organization({
    name,
    _createId,
    _organizationId: mongoose.Types.ObjectId(),
  });

  return await org.save();
};

/**
 * 获取我参与的所有企业
 * @param {string} _userId 
 */
export const getMyOrgs = async (_userId) => {
  return await Organization.find({
    _createId: _userId
  });
};