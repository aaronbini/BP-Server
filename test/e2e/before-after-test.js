//start db, store connection
const connection = require('../../lib/mongoose-setup');

//drop db before starting
before( done => {
  console.log('before all tests: ');
  const drop = () => connection.db.dropDatabase(done);
  if (connection.readyState === 1) drop();
  else connection.once('open', drop);
});

//close connection after all tests run
after(() => {
  console.log('after all tests');
  connection.close();
});


// start the db, and store connection,
// const connection = require( '../../lib/mongoose-setup' );

// drop the database before starting:
// const db = require('./db');
// before(db.drop());

// close connection when done:
// after(() => connection.close());
