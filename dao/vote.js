const dao = require('./base');
class Vote {
  constructor({
    id,
    username,
    specialgroup,
    channel,
    link,
    votetext
  }) {
    this.id = id;
    this.username = username;
    this.specialgroup = specialgroup;
    this.channel = channel;
    this.link = link;
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
  static async create({username, userid, specialgroup, specialgroupid, channel, link, votetext}) {
    return await dao.knex
      .insert({username, userid, specialgroup, specialgroupid, channel, link, votetext})
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
    return votes_arr;
  }

  /**
   * Get list by specialgroup
   * @param specialgroup
   * @return {Promise<*>}
   */
  static async getListBySpecialGroupID(specialgroupid) {
    const votes_arr = await dao.knex
      .select()
      .from('votes')
      .where({
        specialgroupid
      })
      .orderByRaw('vip ASC');
    return votes_arr;
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
    return votes_arr;
  }

  static async getVoteList() {
    const votes_arr = await dao.knex
      .select()
      .from('votes')
      .orderBy('vip', 'desc');
    return votes_arr.map((vote) => {
      return {
        chanel: vote.channel,
        link: vote.link,
        text: vote.votetext
      }
    });
  }

  static async getChucBefore(channelid){
    return  dao.knex
      .select('chucbefore')
      .from('votes')
      .where({channelid})
  }

  static async getChucListBefore(){
    const votes_arr = await dao.knex
      .select('channel', 'chucbefore')
      .from('votes')
      return votes_arr;
    }

    static async getChucListAfter(){
      const votes_arr = await dao.knex
        .select('channel', 'chucafter')
        .from('votes')
        return votes_arr;
      }

  static async setChucBefore(channelid, chucbefore){
    return dao.knex
      .update({ chucbefore })
      .from('votes')
      .where({ channelid })
  }

  static async getChucAfter(channelid){
    return  dao.knex
      .select('chucafter')
      .from('votes')
      .where({channelid})
  }

  static async setChucAfter(channelid, chucafter){
    return dao.knex
      .update({ chucafter })
      .from('votes')
      .where({ channelid })
  }

  static async setMessageID({specialgroupid, channelid, messageid}){
    return  dao.knex
      .insert({specialgroupid, channelid, messageid})
      .from('messages')
   }

  static async getMessageID(specialgroupid){
    return  dao.knex
      .select()
      .from('messages')
      .where({specialgroupid})
  }

  static async deleteMessages(){
    return dao.knex
      .del()
      .from('messages')
  }


  static async setChannelID(channel, channelid){
    return dao.knex
      .update({ channelid })
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