const mongoose = require('mongoose')
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const logger = require('../utils/logger')

describe('Author up blogs' , () => {
  test('author blogs', () => {
    let authorBlogs = {
      author: 'Edsger W. Dijkstra',
      blogs: 129
    }
    Blog.find({})
      .then(authorsBlogs => {
        const result = listHelper.mostBlogs(authorsBlogs)
        expect(result).toEqual(authorBlogs)
      } )
      .then(() => { mongoose.connection.close() } )
      .catch(error => {
        logger.error(error)
      } )
  } )
} )
