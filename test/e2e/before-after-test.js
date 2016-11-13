//start db, store connection
const connection = require('../../lib/mongoose-setup');

//drop db before starting
before( done => {
  const drop = () => connection.db.dropDatabase(done);
  if (connection.readyState === 1) drop();
  else connection.on('open', drop);
});

//close connection after all tests run
after(() => connection.close());
