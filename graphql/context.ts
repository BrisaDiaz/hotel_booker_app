import type { NextApiRequest, NextApiResponse } from 'next';

export type Context = {
  req: NextApiRequest;
};

export async function createContext(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Context> {
  return {
    req: req,
  };
}
