const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request , response) => {
  Blog
    .find( { } )
    .then( blogs => {
      response.json(blogs)
    } )
} )
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then( blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
} )
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body )
  blog
    .save()
    .then(result => {
      response.status(201 ).json(result)
    } )
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
  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  Blog.findByIdAndUpdate(request.params.id ,note , { new: true } )
    .then(updatedBlog => {
      response.json(updatedBlog)
    } )
    .catch(error => next(error))
} )

module.exports = blogsRouter
