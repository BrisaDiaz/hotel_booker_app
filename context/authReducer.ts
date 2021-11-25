import { SET_SESSION, RESET_SESSION } from './authActions';
import { SessionPayload } from '@/interfaces/index';

interface Action {
  payload: SessionPayload | {};
  type: string;
}
export default function authReducer(
  state: SessionPayload | {},
  action: Action
) {
  if (action.type === SET_SESSION) {
    const user = action.payload ? action.payload?.user : {};

    return { user };
  }
  if (action.type === RESET_SESSION) {
    return { user: {} };
  }
  return state;
}
