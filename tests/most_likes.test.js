const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

describe('Most likes' , () => {
  test('most likes blog', () => {
    Blog.find( { } )
      .then(blogLists => {
        const author = {
          author: 'Edsger W. Dijkstra',
          likes: 12
        }
        const result = listHelper.mostLikes(blogLists)
        expect(result).toEqual(author)
      } )
      .then(() => { mongoose.connection.close() } )
      .catch(err => {
        logger.error(err)
      })
  } )
} )
