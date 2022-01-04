import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  const server = new ApolloServer({ schema, context: createContext });

  await server.start();

  await server.createHandler({
    path: `/api/graphql`,
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
