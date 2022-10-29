const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog
    .findById(request.params.id)
    response.json(blog)
} )

blogsRouter.post('/', async (request, response, next) => {
  let body = request.body
  const user = await User.findById(body.userId)
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
} )
blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    } )
    .catch(error => next(error))
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
