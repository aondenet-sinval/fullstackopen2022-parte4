const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
describe('test router login and users', () => {

  beforeEach(async () => {
    let password = 'salainen'

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = {
      'username': 'root',
      'password': passwordHash
    }
    await User.deleteMany({})
    let userObject = new User(user)
    await userObject.save()
  })
  // created test login
  test('create login', async () => {
    // create user
    const newUser = {
      'username': 'root2',
      'name': 'Superuser',
      'password': 'salainen'
    }
    await api
      .post('/api/users')
      .send(newUser)
    await expect(201)
  })

})
