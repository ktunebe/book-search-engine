import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				email
				username
			}
		}
	}
`

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		user(username: $username, email: $email, password: $password) {
			token
			user {
				email
				username
			}
		}
	}
`

export const SAVE_BOOK = gql`
	mutation saveBook($book: BookInput!) {
		saveBook(book: $book) {
			email
		}
	}
`

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
