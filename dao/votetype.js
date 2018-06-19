const dao = require('./base');

class VoteTypeDao {
  static async setType({specialgroupid, type}) {
    return await dao.knex
      .insert({
        specialgroupid,
        type
      })
      .from('votetype')
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