import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the GraphQL API URL
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // Update this if your backend URL is different
  credentials: 'include', // Ensure credentials like cookies are sent
});

// Middleware to attach the token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage or cookies
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '', // Add Bearer token if available
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
