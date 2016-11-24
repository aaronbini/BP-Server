const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../lib/app');
chai.use(chaiHttp);

module.exports = chai.request(app);
