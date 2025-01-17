import { useState, useEffect } from 'react'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'

import Auth from '../utils/auth'
import { removeBookId } from '../utils/localStorage'
import { GET_ME } from '../utils/queries'
import { REMOVE_BOOK } from '../utils/mutations'

// Used AI to help get books to delete immediately when button is clicked
const SavedBooks = () => {
	const [removeBook] = useMutation(REMOVE_BOOK)

	// Query to get user data and their saved books
	const { loading, error, data } = useQuery(GET_ME)
	// Initialize state with user data
	const [userData, setUserData] = useState({})

	useEffect(() => {
		// Update userData state when data from the query changes
		if (data) {
			setUserData(data.me)
		}
	}, [data])

	// Function to handle deleting a book from the database
	const handleDeleteBook = async (bookId) => {
		// Get the token for authorization
		const token = Auth.loggedIn() ? Auth.getToken() : null

		if (!token) {
			return false
		}

		try {
			const { data } = await removeBook({ variables: { bookId } })
			if (!data) {
				throw new Error('something went wrong!')
			}

			// Update local state to remove the deleted book
			setUserData((prevData) => ({
				...prevData,
				savedBooks: prevData.savedBooks.filter(
					(book) => book.bookId !== bookId
				),
			}))

			// Remove the book ID from local storage
			removeBookId(bookId)
		} catch (err) {
			console.error(err)
		}
	}

	if (loading) {
		// Display a loading message while data is being fetched
		return <h2>LOADING...</h2>
	}

	return (
		<>
			<div fluid="true" className="text-light bg-dark p-5">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className="pt-5">
					{userData.savedBooks?.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1 ? 'book' : 'books'
						  }:`
						: 'You have no saved books!'}
				</h2>
				<Row>
					{userData.savedBooks?.map((book) => (
						<Col md="4" key={book.bookId}>
							<Card border="dark">
								{book.image && (
									<Card.Img
										src={book.image}
										alt={`The cover for ${book.title}`}
										variant="top"
									/>
								)}
								<Card.Body>
									<Card.Title>{book.title}</Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<Card.Text>{book.description}</Card.Text>
									<Button
										className="btn-block btn-danger"
										onClick={() => handleDeleteBook(book.bookId)}>
										Delete this Book!
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</>
	)
}

export default SavedBooks
