const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog
      .findById(request.params.id)
    response.json(blog)
  } catch (error) {
    next(error)
  }
} )

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {

    const user = request.user
    // console.log('user ', user);
    const blog = new Blog( {
      title: body.title,
      author: body.author,
      blogs: body.blogs,
      url: body.url,
      likes: body.likes,
      user: user._id
    } )
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    //middleware errorHandler lanced
    next(error)
  }
} )
blogsRouter.delete('/:id', async (request, response, next) => {

  const user = request.user
  try {
    const blog = await Blog.findById(request.params.id)
    if (JSON.stringify(user._id) === JSON.stringify(blog.user)) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }else {
      return response.status(400).json( {
        error: 'blog não encontrado'
      } )
    }
  } catch (error) {
    next(error)
  }
} )
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    blogs: body.blogs,
    url: body.url,
    likes: body.likes,
  }
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    .then(updatedBlog => {
      response.json(updatedBlog)
    } )
    .catch(error => next(error))
} )

module.exports = blogsRouter
