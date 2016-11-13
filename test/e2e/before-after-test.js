// start the db, and store connection, 
const connection = require('../../lib/mongoose-setup');

// drop the database before starting:
const db = require('./db');
before(db.drop());

// close connection when done:
after(() => connection.close());
