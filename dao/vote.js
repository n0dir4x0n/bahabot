const dao = require('./base');
class Vote {
  constructor({
    id,
    username,
    specialgroup,
    channel,
    url,
    votetext
  }) {
    this.id = id;
    this.username = username;
    this.specialgroup = specialgroup;
    this.channel = channel;
    this.url = url;
    this.votetext = votetext;
  }
}

class VoteDao {
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
    specialgroup,
    channel,
    url,
    votetext
  }) {
    return await dao.knex
      .insert({
        id,
        username,
        specialgroup,
        channel,
        url,
        votetext
      })
      .from('votes')
  }

  /**
   * Get list
   * @return {Promise<*>}
   */
  static async getList() {
    const votes_arr = await dao.knex
      .select()
      .from('votes');
    return votes_arr.map(vote => new Vote(vote));
  }

  /**
   * Get list by specialgroup
   * @param specialgroup
   * @return {Promise<*>}
   */
  static async getListBySpecialGroup(specialgroup) {
    const votes_arr = await dao.knex
      .select()
      .from('votes')
      .where({
        specialgroup
      });
    return votes_arr.map(vote => new Vote(vote));
  }

  /**
   * Get channels list by specialgroup
   * @param specialgroup
   * @return {Promise<*>}
   */
  static async getChannelsListBySpecialGroup(specialgroup) {
    const votes_arr = await dao.knex
      .select('channel')
      .from('votes')
      .where({ specialgroup });
    return votes_arr.map(vote => vote.channel);
  }

  static async getVoteList() {
    const votes_arr = await dao.knex
      .select()
      .from('votes')
      .orderBy('vip', 'desc');
    return votes_arr.map((vote) => {
      return {
        chanel: vote.channel,
        url: vote.url,
        text: vote.votetext
      }
    });
  }

  static async getUserCountByChannel(channel){
    return  dao.knex
      .select('channeluserscount')
      .from('votes')
      .where({channel})
  }

  static async setUserCountByChannel(channel, channeluserscount){
    return dao.knex
      .update({ channeluserscount })
      .from('votes')
      .where({ channel })
  }

  /**
   * Get person by id
   * @param id
   * @return {Promise<*>}
   */
  static async getById(id) {
    const data = await dao.knex
      .select()
      .from('votes')
      .where({
        id
      })
      .first();
    return new Vote(data);
  }


  static async updateVIP(username, vip) {
    return dao.knex
      .update({
        vip
      })
      .from('votes')
      .where({
        username
      })
  }

  static async activateByChannel(channel) {
    return dao.knex
      .update({
        isactive: true
      })
      .from('votes')
      .where({
        channel
      })
  }

  static async deactivateByChannel(channel) {
    return dao.knex
      .update({
        isactive: false
      })
      .from('votes')
      .where({
        channel
      })
  }

  /**
   * Update person by id
   * @param id
   * @param name
   * @param date_of_birth
   * @param address
   * @param country
   * @param email
   * @return {Promise<*>}
   */
  static async update(id, {
    name,
    date_of_birth,
    address,
    country,
    email
  }) {
    return dao.knex
      .update({
        name,
        date_of_birth,
        address,
        country,
        email
      })
      .from('votes')
      .where({
        id
      })
  }

  /**
   * Delete person  by id
   * @param id
   * @return {Promise<*>}
   */
  static async delete(id) {
    return dao.knex
      .from('votes')
      .where({
        id
      })
      .del();
  }

  /**
   * Batch insert
   * @param person_arr
   * @return {Promise<boolean>}
   */
  static async batch(person_arr) {
    // person_arr.forEach(async ({name, date_of_birth, address, country, email}) => {
    //   await dao.knex
    //     .insert({ name, date_of_birth, address, country, email })
    //     .from('votes')
    // });
    await dao.knex.batchInsert('votes', person_arr, person_arr.length);
    return true;
  }

  /**
   * Get persons by country
   * @param country
   * @return {Promise<*>}
   */
  static async getByCountry(country) {
    return dao.knex
      .from('votes')
      .where({
        country
      })
  }

  /**
   * get by min age
   * @param age {Number}
   * @return {Promise<*>}
   */
  static async getByMinAge(age) {
    return dao.knex
      .select('id', 'name', dao.knex.raw(`date_part('year', age(date_of_birth)) as age`))
      .from('votes')
      .whereRaw(`date_part('year', age(date_of_birth)) >= ${age}`)
  }

}

module.exports = VoteDao;