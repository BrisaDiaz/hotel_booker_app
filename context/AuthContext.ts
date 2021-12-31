import { createContext } from 'react';

const AuthContext = createContext({
  session: {
    user: null,
  },
  loading: false,
  setSession: (user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }) => {},
  resetSession: () => {},
});
export default AuthContext;
