import type { NextApiRequest, NextApiResponse } from 'next';

interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function createContext({ req, res }: Context): Promise<Context> {
  return {
    req: req,
    res: res,
  };
}
