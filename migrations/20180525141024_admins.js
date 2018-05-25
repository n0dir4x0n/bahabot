
exports.up = function(knex, Promise) {
   return Promise.all([
      knex.schema.createTable('admins', function (table) {
          table.increments();
          table.string('username');
          table.boolean('isactive');
       }),
};

exports.down = function(knex, Promise) {
   return Promise.all([
      knex.schema.dropTable('admins')
  ])
};
