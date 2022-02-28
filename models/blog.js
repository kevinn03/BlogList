const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
  image: {
    type: String,
    default:
      'https://cdn.iconscout.com/icon/free/png-256/list-message-2367725-1976875.png',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model('Blog', blogSchema);
