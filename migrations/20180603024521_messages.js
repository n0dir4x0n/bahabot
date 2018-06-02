
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('messages', function (table) {
            table.increments();
            table.string('specialgroupid');
            table.string('channelid');
            table.string('messageid');
            table.timestamps();
         })])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('messages')
    ])
};
