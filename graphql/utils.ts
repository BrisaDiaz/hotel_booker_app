import { verify, sign } from 'jsonwebtoken';
import { compare, hash, genSalt } from 'bcryptjs';
import type { NextApiRequest } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const APP_SECRET = process.env.APP_SECRET || publicRuntimeConfig.APP_SECRET;
export interface tokenPayload {
  userId: Number;
}

export async function getUser(req: NextApiRequest) {
  const token = await verifyToken(req);
  return token.user || null;
}
export async function hashPassword(password: string) {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashPassword = await hash(password, salt);
  return hashPassword;
}
export async function compirePassword(
  storePassword: string,
  inputPassword: string
) {
  const match = await compare(inputPassword, storePassword);
  return match;
}
async function verifyToken(req: NextApiRequest) {
  const Authorization = req.headers.authorization;

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken: any = await verify(token, APP_SECRET);

    return verifiedToken || null;
  }
  return null;
}

export async function signToken(id: number, role: string) {
  const token = await sign({ user: { id: id, role: role } }, APP_SECRET);

  return token;
}
