const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const createAuthorization = async () => {
  //Token creation route
  const resultAuthorizaton = await api.post('/api/login')
    .send( { username: 'root', password: 'nenialas' } )
  const resp = await resultAuthorizaton.body
  //End of token definition
  const token = await resp.token//Valid token set
  return token
}

module.exports = createAuthorization
