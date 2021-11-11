import {
  InMemoryCache,
  ApolloClient,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:3000/api/graphql',
    }),
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
