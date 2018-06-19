
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votetype', function (table) {
            table.increments();
            table.string('specialgroupid');
            table.string('type');
            table.timestamps();
         }),

    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votetype')
    ])
};
