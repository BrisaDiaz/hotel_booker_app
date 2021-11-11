import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '../../graphql/context';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const server = new ApolloServer({ schema, context: createContext(req, res) });

  await server.start();

  await server.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
