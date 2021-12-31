import { SET_SESSION, RESET_SESSION } from './authActions';
import { SessionPayload } from '@/interfaces/index';

interface Action {
  payload: SessionPayload | {};
  type: string;
}
export default function authReducer(state: any, action: Action) {
  if (action.type === SET_SESSION) {
    return {
      user: 'user' in action.payload ? action.payload?.user : action.payload,
    };
  }
  if (action.type === RESET_SESSION) {
    return { user: null };
  }
  return state;
}
