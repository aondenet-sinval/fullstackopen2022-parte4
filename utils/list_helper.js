const dummy = (array) => {
  const reducer = (a, b) => {
    return a + b
  }
  return array.length === 0
    ? 1
    : array.reduce(reducer, 0) / array.reduce(reducer, 0)
}

const totalLikes = (array) => {
  const sum = (a, b) => {
    return a + b
  }
  return array.reduce(sum, 0)
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
    es = lk
  })
  return es.toJSON()
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
