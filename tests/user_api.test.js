const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const Blog = require('../models/blog')
// const listHelper = require('../utils/list_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const initialUsers = [
  {
    "username": "nanny",
    "name": "Supernani",
    "password": "salainen"
  },
  {
    "username": "root",
    "name": "Superuser",
    "password": "salainen"
  }
]
const userErr = [
  {
    "username": "na",
    "name": "Supernani",
    "password": "salainen"
  },
  {
    "username": "root2",
    "name": "Superuser",
    "password": "sa"
  }
]
//users teste
describe('when there is initially one user in db collection users', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
  })
  test('get all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(200)
  })

} )
describe('tests method posts', () => {
  //
  test('test method post users username unique', async () => {
    await api.post('/api/users').send(initialUsers[0]).expect(400)
      .expect({error: 'username must be unique'})
  } )
  test('test method post users password', async () => {
  const response = await api.post('/api/users').send(userErr[1])
  const result = response.body
  expect(400)
  expect(result).toEqual({error: 'senha não atende ao critério tamanho'})
  } )
})
describe('tests method put', () => {
  //
  test('test method put password', async () => {
  //search id user
  const users = await User.find({})
  const userId = users[0].id
  const response = await api.put(`/api/users/${userId}`)
    .send({password: 'sala4323'})
  const result = response.body
  expect(201)
  } )
  test('test method put password length', async () => {
  //search id user
  const users = await User.find({})
  const userId = users[0].id
  const response = await api.put(`/api/users/${userId}`)
    .send({password: 'oi'})
  const result = response.body
  expect(400)
  } )
})
describe('tests method delete', () => {
  //
  test('test method delete user', async () => {
  //serach id user
  const users = await User.find({})
  const userId = users[0].id
  await api
    .delete(`/api/users/${userId}`)
  expect(204)
  } )
})

afterAll(() => {
  mongoose.connection.close()
})
