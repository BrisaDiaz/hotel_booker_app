import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';
import type { NextApiRequest, NextApiResponse } from 'next';
import env from '@/env';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const server = new ApolloServer({ schema, context: createContext });

  await server.start();

  await server.createHandler({
    path: `${env.HOST}/api/graphql `,
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
