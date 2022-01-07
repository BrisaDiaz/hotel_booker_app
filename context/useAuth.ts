import AuthContext from './AuthContext';
import { useContext } from 'react';
import { SessionPayload } from '../interfaces';
export function useAuth(): {
  setSession: (user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }) => void,
  resetSession: () => void,
  loading: boolean;
  session:
    | SessionPayload
    | {
        user: null;
      };
} {
  return useContext(AuthContext);
}
