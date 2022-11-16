const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI)

const userSchema = new mongoose.Schema( {
  name: String,
  username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true },
  userId: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
} )

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the password should not be revealed
    delete returnedObject.password
  }
} )

module.exports = mongoose.model('User', userSchema)
