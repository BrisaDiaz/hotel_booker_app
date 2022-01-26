import type { NextApiRequest, NextApiResponse } from 'next';
import { verify, Secret } from 'jsonwebtoken';
interface TokenUser {
  id: number;
  role: 'ADMIN' | 'USER';
}
async function getUserFromMiddleware(token: string): Promise<TokenUser | null> {
  const verifiedToken: any = await verify(
    token,
    process.env.APP_SECRET as Secret
  );
  if (!verifiedToken || !verifiedToken?.user) return null;
  return verifiedToken.user;
}

interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  user: TokenUser | null;
}

export async function createContext({ req, res }: Context): Promise<Context> {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : '';

  const user = token ? await getUserFromMiddleware(token) : null;

  return {
    req: req,
    res: res,
    user,
  };
}
