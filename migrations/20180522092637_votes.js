exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votes', function (table) {
            table.increments();
            table.string('username');
            table.string('userid');
            table.string('specialgroup');
            table.string('specialgroupid');
            table.text('channel');
            table.text('channelid');
            table.integer('chucbefore');    //channel users count before
            table.integer('chucafter');     //channel users count after
            table.text('link');
            table.text('votetext');
            table.string('vip');
            table.boolean('isactive');
            table.timestamps();
         }),

    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votes')
    ])
};