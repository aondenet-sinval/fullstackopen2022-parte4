const listHelper = require('../utils/list_helper')
const config = require('../utils/config')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
mongoose.connect(config.MONGODB_URI)
describe ( 'Favorite Blog: ' , () => {
  test('total likes blog', () => {
    let listOneBlog = {
      title: 'Post Número 2',
      author: 'Sinval Gomes',
      url: 'www.sasa.com',
      likes: 10,
      id: '635007c65ea3a08d85aa7496'
    }
    Blog.find( { } ).then(blogLists => {
      const result = listHelper.favoriteBlog(blogLists)
      expect(result).toEqual(listOneBlog)
    }
    ).then(() => { mongoose.connection.close() } )
  } )
} )
