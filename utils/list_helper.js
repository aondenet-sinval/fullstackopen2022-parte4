const User = require('../models/user')
const _ = require('lodash')
const dummy = (array) => {
  const reducer = (a, b) => {
    return a + b
  }
  return array.length === 0
    ? 1
    : array.reduce(reducer, 0) / array.reduce(reducer, 0)
}

const totalLikes = (array) => {
  let arr = []
  array.forEach(lk => {
    arr.push(lk.likes)
  })
  return _.sum(arr)
}
const favoriteBlog = (listBlog) => {
  let arr = []
  listBlog.forEach(lk => {
    arr.push(lk.likes)
  })
  const max = arr.reduce((a,b) => { return a > b ? a : b } )
  const likes = listBlog.filter(l => l.likes === max)
  let es = { }
  likes.forEach(lk => {
    es = { title: lk.title, author: lk.author, likes: lk.likes }
  })
  return es
}
const mostBlogs = (array) => {
  let arrayBlogs = []
  array.forEach(i => {
    arrayBlogs.push(i.blogs)
  })
  const maximo = _.max(arrayBlogs)
  let authorMax = _.find(array, function(o) {return o.blogs === maximo } )
  let author = {
    author: authorMax.author,
    blogs: authorMax.blogs
  }
  return author
}
const mostLikes = (array) => {
  //Returns author and total likes
  let arrayLikes = []
  array.forEach(i => {
    arrayLikes.push(i.likes)
  })
  const maximo = _.max(arrayLikes)
  let authorLikes = _.find(array, function(o) {return o.likes === maximo } )
  const upLikes = {
    author: authorLikes.author,
    likes: authorLikes.likes
  }
  return upLikes
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  usersInDb
}
