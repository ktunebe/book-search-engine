const { User } = require('../models');
const { AuthenticationError, signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id)
      }
      throw AuthenticationError
    }
  },
  Mutation: {
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email })

      if (!user) {
        throw AuthenticationError
      }
      const isCorrectPassword = user.isCorrectPassword(password)
      if (!isCorrectPassword) {
        throw AuthenticationError
      }

      const token = signToken(user)
      return { token, user }
    },
    addUser: async (parent, { username, email, password }, context) => {
      const user = await User.create({ username, email, password });

      const token = signToken(user)
      return { token, user }
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        )
      }
      throw AuthenticationError
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // only allow users to remove their own books
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw AuthenticationError
    },
  }
}

module.exports = resolvers
