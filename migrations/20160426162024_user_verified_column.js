exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.boolean('is_verified');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t){
    t.dropColumn('is_verified');
  })
};
