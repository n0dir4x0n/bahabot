const dao = require('./base');

class VoteTypeDao {
  static async createType({specialgroupid}) {
    return await dao.knex
      .insert({
        specialgroupid
      })
      .from('votetype')
  }

  static async setType({specialgroupid}) {
    return dao.knex
      .update({ type })
      .from('votes')
      .where({ specialgroupid })
  }


  static async getType({specialgroupid}) {
    const votetype_arr = await dao.knex
      .select({specialgroupid})
      .from('votetype')
      .limit(1);
    return votetype_arr.map(x => x.type)[0];
  }

}

module.exports = VoteTypeDao;