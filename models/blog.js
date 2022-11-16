const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema( {
  title: { type: String, required: true },
  author: { type: String, required: true },
  blogs: Number,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
} )

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
} )

module.exports = mongoose.model('Blog', blogSchema)
