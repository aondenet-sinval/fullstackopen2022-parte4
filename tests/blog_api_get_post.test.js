const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

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

describe('test router get', () => {
  //test com async/await
  test('all blogs are returned', async () => {
    //Token creation route
    const resultAuthorizaton = await api.post('/api/login')
      .send( { username: 'root', password: 'nenialas' } )
    const response = await resultAuthorizaton.body
    //End of token definition
    const token = await response.token//Valid token set
    const result = await api.get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)

    expect(result.body).toHaveLength(initialBlogs.length)
  })
  //searching if likes property has been set
  test('search prop likes defined', async () => {
    let propLikes = { }
    await initialBlogs.forEach(result => {
      propLikes = result
    })

    await expect(propLikes).toHaveProperty('likes')
  })
})
describe('test router post', () => {
  test('test method post not authorizad', async () => {
    const users = await User.find( { } )
    const blogPost = {
      title: 'Using Async/Await test',
      author: 'Robert w. D.',
      blogs: 5,
      url: 'http://www.teste-post.com',
      likes: 11,
      userId: users[1]._id,
    }
    await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .send(blogPost)
      .expect(401)
  })
  //test method post
  test('test method post authorizad', async () => {
    //Token creation route
    const resultAuthorizaton = await api.post('/api/login')
      .send( { username: 'root', password: 'nenialas' } )
    const response = await resultAuthorizaton.body
    //End of token definition
    const token = response.token
    const users = await User.find( { } )
    const blogPost = {
      title: 'Using Async/Await test',
      author: 'Robert w. D.',
      blogs: 5,
      url: 'http://www.teste-post.com',
      likes: 11,
      userId: users[1]._id,
    }
    await api.post('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send({ username: users[1].username, name: users[1].name })
      .send(blogPost)
      .expect(201)
  })
  //Test for blocking of posts without the title property
  test('test blog create prop title undefined', async () => {
    const users = await User.find( { } )
    const blogUndefinedTitle = {
      author: 'Robert w. D.',
      blogs: 5,
      url: 'http://www.teste-prop-title.com',
      likes: 11,
      userId: users[1].id
    }

    //Token creation route
    const resultAuthorizaton = await api.post('/api/login')
      .send( { username: 'root', password: 'nenialas' } )
    const response = await resultAuthorizaton.body
    //End of token definition
    const token = response.token
    await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
      .send( { username: users[1].username, name: users[1].name } )
      .send(blogUndefinedTitle)
    expect(400)
  } )
})
describe('test propId', () => {
  //run this test individually
  test('test prop ID undefined', async () => {
    //Token creation route
    const resultAuthorizaton = await api.post('/api/login')
      .send( { username: 'root', password: 'nenialas' } )
    const response = await resultAuthorizaton.body
    //End of token definition
    const token = response.token
    const result = await api.get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${token}`)
    const res = await result.body
    let propId = []
    await res.forEach(result => {
      propId.push(result.id)
    } )
    expect(propId).toBeDefined()
  } )
} )

afterAll(() => {
  mongoose.connection.close()
} )
