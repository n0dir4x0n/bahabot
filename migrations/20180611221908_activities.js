
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('activities', function (table) {
            table.increments();
            table.string('specialgroupid');
            table.unique('specialgroupid');
            table.boolean('isactive');
            table.boolean('isdeleted');
            table.timestamps();
         })])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('activities')
    ])
};
