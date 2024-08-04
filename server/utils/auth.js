const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

// Token secret and expiration
const secret = 'shhhhhhhhhhhhhhh'
const expiration = '2h'

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user', {
    extensions: {
      code: 'UNAUTHENTICATED'
    }
  }),
  signToken({ _id, name, email }) {
    const payload = { _id, name, email }
    return jwt.sign(payload, secret, { expiresIn: expiration })
  },
  authMiddleware({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization 

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim()
    }
    
    if (!token) {
      return req
    }
    
    try {
      const data = jwt.verify(token, secret, { maxAge: expiration })
      req.user = data
    } catch(error) {
      console.log('Invalid token')
    }

    return req
  }
}
