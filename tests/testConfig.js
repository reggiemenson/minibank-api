const chai = require('chai')
global.expect = chai.expect

const supertest = require('supertest')
const app = require('../app')
global.api = supertest(app)

const config = require('../config/environment')
global.testConfig = config
