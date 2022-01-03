import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const isBrowser = typeof window !== undefined;
const httpLink = createHttpLink({
  uri: `/api/graphql`,

  credentials: 'include',
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
    ssrMode: !isBrowser,
    connectToDevTools: isBrowser,
    cache: new InMemoryCache(),
  });
}

function initializeApollo() {
  apolloClient = apolloClient ?? createApolloClient();
  return apolloClient;
}

export function initApollo() {
  return initializeApollo();
}
export const client = initApollo();
