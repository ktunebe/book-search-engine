const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				return await User.findById(context.user._id)
			}
			throw AuthenticationError
		},
	},
	Mutation: {
		addUser: async (parent, { user }) => {
			console.log(user)
			user = await User.create(user)
			if (!user) return 'Unable to create user'
			const token = signToken(user)
			console.log(user)
			return { token, user }
		},
		login: async (parent, { email, password }, context) => {
			const user = await User.findOne({ email })

			if (!user) throw AuthenticationError

			const isCorrectPassword = user.isCorrectPassword(password)

			if (!isCorrectPassword) throw AuthenticationError
			console.log(user)
			const token = signToken(user)
			return { token, user }
		},
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
