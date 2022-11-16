const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
// mongoose.connect(config.MONGODB_URI)
describe('Favorite Blog' , () => {
  test('max likes blog', () => {
    let listOneBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    Blog.find( { } )
      .then(blogLists => {
        const result = listHelper.favoriteBlog(blogLists)
        expect(result).toEqual(listOneBlog)
      } )
      .then(() => { mongoose.connection.close() } )
      .catch(err => {
        logger.error(err)
      })
  } )
} )
