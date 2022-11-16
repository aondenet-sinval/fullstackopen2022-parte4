const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
// mongoose.connect(config.MONGODB_URI)
describe('Most likes' , () => {
  test('most likes blog', () => {
    Blog.find( { } )
      .then(blogLists => {
        const author = {
          author: 'Edsger W. Dijkstra',
          likes: 12
        }
        // console.log('maximo ', maximo)
        const result = listHelper.mostLikes(blogLists)
        expect(result).toEqual(author)
      } )
      .then(() => { mongoose.connection.close() } )
      .catch(err => {
        logger.error(err)
      })
  } )
} )
