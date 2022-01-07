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
 
  session:
    | SessionPayload
    | {
      loading:boolean;
        user: null;
      };
} {
  return useContext(AuthContext);
}
