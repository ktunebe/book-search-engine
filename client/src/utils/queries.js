import { gql } from '@apollo/client'

// Get current user info
export const GET_ME = gql`
query me {
    me {
    _id
    username
    email
    savedBooks {
      title
      bookId
    }
  }
}
`