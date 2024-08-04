import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from './utils/auth.js'

import App from './App.jsx'
import SearchBooks from './pages/SearchBooks'
import SavedBooks from './pages/SavedBooks'

const httpLink = createHttpLink({
	uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
	const token = auth.getToken()

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	}
})

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <h1 className="display-2">Wrong page!</h1>,
		children: [
			{
				index: true,
				element: <SearchBooks />,
			},
			{
				path: '/saved',
				element: <SavedBooks />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={apolloClient}>
		<RouterProvider router={router} />
	</ApolloProvider>
)
