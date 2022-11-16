const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

describe('Total likes' , () => {
  test('total likes blog', () => {
    let arr = []
    Blog.find( { } ).then(result => {
      result.forEach(lk => {
        arr.push(lk)
      })
    }).then(() => {
      const value = listHelper.totalLikes(arr)
      expect(value).toBe(36)
    }).then(() => { mongoose.connection.close() } )

  } )
} )
