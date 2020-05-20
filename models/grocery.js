import mongoose from 'mongoose'

const grocerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30
    },
    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    }
  }
)

module.exports = mongoose.model('Grocery', grocerySchema)