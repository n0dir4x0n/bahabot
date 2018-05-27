exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votes', function (table) {
            table.increments();
            table.string('username');
            table.string('specialgroup');
            table.text('channel');
            table.text('channeluserscount');
            table.string('link');
            table.string('votetext');
            table.string('vip');
            table.boolean('isactive');
         }),

    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votes')
    ])
};