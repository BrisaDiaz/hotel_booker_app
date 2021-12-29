import { createContext } from 'react';

const AuthContext = createContext({ session: { user: null }, loading: false });
export default AuthContext;
