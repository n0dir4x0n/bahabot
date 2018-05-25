const dao = require('./base');
class Vote {
  constructor({
    id,
    username,
    isactive
  }) {
    this.id = id;
    this.username = username;
    this.isactive = isactive;
  }
}

class AdminDao {
  /**
   * Create person
   * @param name
   * @param date_of_birth
   * @param address
   * @param country
   * @param email
   * @return {Promise<*>}
   */
  static async create({
    id,
    username,
  }) {
    return await dao.knex
      .insert({
        id,
        username,
        isactive: true
      })
      .from('admins')
  }

  /**
   * Get list
   * @return {Promise<*>}
   */
  static async getList() {
    const admins_arr = await dao.knex
      .select()
      .from('admins');
    return admins_arr.map(vote => new Vote(vote));
  }


  static async activate(username) {
    return dao.knex
      .update({
        isactive: true
      })
      .from('admins')
      .where({
        username
      })
  }

  static async deactivate(username) {
    return dao.knex
      .update({
        isactive: false
      })
      .from('admins')
      .where({
         username
      })
  }
}

module.exports = AdminDao;