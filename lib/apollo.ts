import {
  InMemoryCache,
  ApolloClient,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import env from '@/env';
const isBrowser = typeof window !== undefined;
const httpLink = createHttpLink({
  uri: env.BACKEND_URL,

  credentials: 'same-origin',
});

let apolloClient: ApolloClient<NormalizedCacheObject>;
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
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
