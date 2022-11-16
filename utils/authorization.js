const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const createAuthorization = async () => {
  //Rota de criação do token
  const resultAuthorizaton = await api.post('/api/login')
    .send( { username: 'root', password: 'nenialas' } )
  const resp = await resultAuthorizaton.body
  //Fim da definição do token
  const token = await resp.token//Token válido definido
  return token
}

module.exports = createAuthorization
