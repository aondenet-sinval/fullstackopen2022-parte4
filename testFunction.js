const config = require('./utils/config')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
mongoose.connect(config.MONGODB_URI)

Blog.find( { } ).where('likes').then(result => {
  console.log('list blogs ', result)
  let arr = []
  result.forEach(lk => {
    arr.push(lk.likes)
  })
  //number likes definition
  const max = arr.reduce((a,b) => { return a > b ? a : b } )
  const likes = result.filter(l => l.likes === max)
  likes.forEach(lk => {
    console.log('lk ', lk.toJSON())
  })
  console.log('likes ', likes)
} ).then(() => { mongoose.connection.close() } )
