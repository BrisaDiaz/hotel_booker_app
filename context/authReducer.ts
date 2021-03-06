import { SET_SESSION, RESET_SESSION } from './authActions';
import { SessionPayload } from '@/interfaces/index';

interface Action {
  payload: SessionPayload | null;
  type: string;
}
export default function authReducer(state: any, action: Action) {
  if (action.type === SET_SESSION) {
    return action.payload;
  }
  if (action.type === RESET_SESSION) {
    return { loading: false, user: null, token: '' };
  }
  return state;
}
