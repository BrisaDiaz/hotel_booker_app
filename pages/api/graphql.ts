import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';
import { createContext } from '../../graphql/context';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminInfo } from '../../graphql/utils/index';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.referer && req.headers.referer.includes('admin')) {
    try {
      const profile = await getAdminInfo(req, res);
    } catch (error) {
      return res.redirect(307, '/signin');
    }
  }
  const server = new ApolloServer({ schema, context: createContext });

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
