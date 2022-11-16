const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const createAuthorization = require('../utils/authorization')

const initialUsers = [
  {
    'username': 'nanny',
    'name': 'Supernani',
    'password': 'salainen'
  },
  {
    'username': 'root',
    'name': 'Superuser',
    'password': 'nenialas'
  }
]

let initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'S. M. V',
    blogs: 2,
    url: 'http://www.teste.com',
    likes: 20,
    user: 'ss',
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'Albert C. D.',
    blogs: 10,
    url: 'http://www.teste.com',
    likes: 20,
    user: 'ss',
  }
]

beforeEach(async () => {
  const saltRounds = 10

  let password = initialUsers[0].password
  let passwordHash = await bcrypt.hash(password, saltRounds)
  initialUsers[0].password = passwordHash

  password = initialUsers[1].password
  passwordHash = await bcrypt.hash(password, saltRounds)
  initialUsers[1].password = passwordHash

  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()

  const users = await User.find( { } )

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  blogObject.user = await users[0]._id
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  blogObject.user = await users[1]._id
  await blogObject.save()
  // token create

})

describe('test router delete', () => {
  test('test delete one for id', async () => {
    //defined userId
    const users = await User.find( { } )
    //Token
    const token = await createAuthorization()
    const response = await api.get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
    const body = await response.body
    //define id
    const blogId = await body[1].id
    const id = await users[1].id
    const responseDelete = await api
      .delete(`/api/blogs/${blogId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send({ userId: id })
    expect(responseDelete.statusCode).toBe(204)
  })
  test('test delete error for different id', async () => {
    //Token
    const token = await createAuthorization()
    const response = await api.get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
    const res = response.body
    //define id
    const idUser = res[1].user.id
    let blogId = res[1].id
    blogId = blogId.substring(9)//crashing id

    const responseDelete = await api
      .delete(`/api/blogs/${blogId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send({ userId: idUser })
    expect(responseDelete.statusCode).toBe(400)//response status 400
  })
})
describe('test router update', () => {
  test('update likes post', async () => {
    //Token
    const token = await createAuthorization()
    //define id
    const response = await api.get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
    let res = await response.body
    let id = res[1].id

    const valuesUpdate = {
      title: 'HTML is easy',
      author: 'S. M. V',
      blogs: 2,
      url: 'http://www.teste.com',
      likes: 55,
    }
    const responseUpdate = await api.put(`/api/blogs/${id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send(valuesUpdate)
    const result = await responseUpdate.body
    //aplicando teste na atualização
    expect(result.likes).toBe(valuesUpdate.likes)
  } )

})

afterAll(() => {
  mongoose.connection.close()
})
