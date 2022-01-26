import AuthContext from './AuthContext';
import { useContext } from 'react';
import { SessionPayload } from '../interfaces';
export function useAuth(): {
  setSession: (authPayload: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: 'ADMIN' | 'USER';
    };
    token: string;
  }) => void;
  resetSession: () => void;

  session:
    | SessionPayload
    | {
        loading: boolean;
        user: null;
        token: string;
      };
} {
  return useContext(AuthContext);
}
