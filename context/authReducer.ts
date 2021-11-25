import { SET_SESSION, RESET_SESSION } from './authActions';
interface State {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
}
interface Action {
  payload: State | {};
  type: string;
}
export default function authReducer(state: State, action: Action) {
  if (action.type === SET_SESSION) {
    const { user } = action.payload;

    return { user };
  }
  if (action.type === RESET_SESSION) {
    return { user: {} };
  }
  return state;
}
