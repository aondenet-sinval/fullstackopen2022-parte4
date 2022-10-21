const listHelper = require('../utils/list_helper')
const config = require('../utils/config')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
mongoose.connect(config.MONGODB_URI)
describe ( 'Total likes: ' , () => {
  test('total likes blog', () => {
    let arr = []
    Blog.find( { } ).where('likes').then(result => {
      result.forEach(lk => {
        return arr.push(lk.likes)
      })
    }).then(() => {
      const value = listHelper.totalLikes(arr)
      expect(value).toBe(18)
    }).then(() => { mongoose.connection.close() } )

  } )
} )
