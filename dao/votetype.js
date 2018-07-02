const dao = require('./base');

class VoteTypeDao {
  static async createType(specialgroupid) {
    return await dao.knex
      .insert({
        specialgroupid
      })
      .from('votetype')
  }

  static async setType(specialgroupid, type) {
    return await dao.knex
      .update({ type })
      .from('votetype')
      .where({ specialgroupid })
  }

  static async getType(specialgroupid) {
    const arr = await dao.knex
    .select('type')
    .from('votetype')
    .where({specialgroupid})
    .limit('1');
    return arr.map(x => x.type)[0];
  }
}

module.exports = VoteTypeDao;