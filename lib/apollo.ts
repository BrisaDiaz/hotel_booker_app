import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
});

let apolloClient: ApolloClient<NormalizedCacheObject>;
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists

  return {
    headers: {
      ...headers,
    },
  };
});

function createApolloClient() {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

function initializeApollo() {
  apolloClient = apolloClient ?? createApolloClient();
  return apolloClient;
}

export function useApollo() {
  return initializeApollo();
}
export const client = useApollo();
