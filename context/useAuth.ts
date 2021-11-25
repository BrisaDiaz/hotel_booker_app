import AuthContext from './AuthContext';
import { useContext } from 'react';

export function useAuth():
  | {
      setSession: Function;
      getSession: Function;
      session: object;
    }
  | {} {
  return useContext(AuthContext);
}
