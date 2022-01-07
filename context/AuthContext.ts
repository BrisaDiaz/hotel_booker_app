/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

const AuthContext = createContext({
  session: {
    user: null,
  },
  loading: true,
  setSession(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }){},
  resetSession(){} ,
});
export default AuthContext;
