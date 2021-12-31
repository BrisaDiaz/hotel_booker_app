import AuthContext from './AuthContext';
import { useContext } from 'react';
import { SessionPayload } from '../interfaces';
export function useAuth(): {
  setSession: Function;
  resetSession: Function;
  loading: boolean;
  session:
    | SessionPayload
    | {
        user: null;
      };
} {
  return useContext(AuthContext);
}
