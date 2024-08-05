import { gql } from '@apollo/client'

// Create new user
export const ADD_USER = gql`
mutation addUser($user: UserInput!) {
  addUser(user: $user) {
    token
    user {
      email
      _id
      savedBooks {
        title
      }
    }
  }
}
`
// Log in existing user
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!,) {
        login(email: $email, password: $password) {
            token
            user {
                email
                username
    }
  }
}
`

// Add book to user list
export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            email
  }
}

`

// Remove book from user list
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            email
            username
            savedBooks {
                title
    }
  }
}

`