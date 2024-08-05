const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
	// query current user
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				return await User.findById(context.user._id)
			}
			throw AuthenticationError
		},
	},
	Mutation: {
		// create new user
		addUser: async (parent, { user }) => {
			console.log(user)
			user = await User.create(user)
			if (!user) return 'Unable to create user'
			const token = signToken(user)
			console.log(user)
			return { token, user }
		},
		// log in current user
		login: async (parent, { email, password }, context) => {
			const user = await User.findOne({ email })

			if (!user) throw AuthenticationError

			const isCorrectPassword = user.isCorrectPassword(password)

			if (!isCorrectPassword) throw AuthenticationError
			console.log(user)
			const token = signToken(user)
			return { token, user }
		},
		// save book to current user list
		saveBook: async (parent, { book }, context) => {
			if (context.user) {
				return User.findOneAndUpdate(
					{ _id: context.user._id },
					{
						$addToSet: { savedBooks: book },
					},
					{ new: true, runValidators: true }
				)
			}
			throw AuthenticationError
		},
		// remove book from current user list
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				return User.findOneAndUpdate(
					{ _id: context.user._id },
					{
						$pull: { savedBooks: { bookId } },
					},
					{ new: true }
				)
			}
			throw AuthenticationError
		},
	},
}

module.exports = resolvers
