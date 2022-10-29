const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'S. M. V',
    blogs: 2,
    url: 'http://www.teste.com',
    likes: 20,
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'Albert C. D.',
    blogs: 10,
    url: 'http://www.teste.com',
    likes: 20,
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
describe('test router get', () => {
  //test com async/await
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  //test prop id
  test('test prop ID undefined', async ()=> {
    const response = await api.get('/api/blogs')
    const res = response.body
    let propId = []
    res.forEach(result => {
      propId.push(result.id)
    })
    expect(propId).toBeDefined()
  })
  //search prop likes defined
  test('search prop likes defined', async () => {
    let propLikes = { }
    await initialBlogs.forEach(result => {
      propLikes = result
    })

    await expect(propLikes).toHaveProperty('likes')
  })
})
describe('test router post', () => {
  //test method post 
  test('test method post', async () => {
    const blogPost = {
      title: 'Using Async/Await test',
      author: 'Robert w. D.',
      blogs: 5,
      url: 'http://www.teste-post.com',
      likes: 11,
    }
    await api
      .post('/api/blogs')
      .send(blogPost)
      .expect(201)

    const response = await api.get('/api/blogs')
    let res = response.body
    expect(res.length).toBe(initialBlogs.length + 1)
  })
  //Testar se há bloqueio de publicações sem a propriedade title
  test('test blog create prop title undefined', async () => {
    const blogUndefinedTitle = {
      author: 'Robert w. D.',
      blogs: 5,
      url: 'http://www.teste-prop-title.com',
      likes: 11,
    }
    await api
      .post('/api/blogs')
      .send(blogUndefinedTitle)
      .expect(400)
  } )
})
describe('test router delete', () => {
  test('test delete one for id', async () => {
    //define id
    const response = await api.get('/api/blogs')
    const res = response.body
    let propId = []
    res.forEach(result => {
      propId.push(result.id)
    })
    const id = propId[0]
    console.log('id que será removed', id)
    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)
  })
})
describe('test router update', () => {
  test('update likes post', async () => {
    //define id
    const response = await api.get('/api/blogs')
    let res = response.body
    let propId = []
    res.forEach(result => {
      propId.push(result.id)
    })
    let id = propId[0]
    console.log("id ", id);
    const valuesUpdate = {
      title: 'HTML is easy',
      author: 'S. M. V',
      blogs: 2,
      url: 'http://www.teste.com',
      likes: 55,
    }
    let result = await api.put(`/api/blogs/${id}`)
      .send(valuesUpdate)
    result = result.body
    //aplicando teste na atualização
    expect(result.likes).toBe(valuesUpdate.likes)
    } )

})

afterAll(() => {
  mongoose.connection.close()
})
