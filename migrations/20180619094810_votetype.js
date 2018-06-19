
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('votetype', function (table) {
            table.increments();
            table.string('specialgroupid');
            table.unique('specialgroupid');
            table.string('type').defaultTo('1');
            table.timestamps();
         }),

    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('votetype')
    ])
};
