import React from 'react';
import { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import authReducer from './authReducer';
import { SET_SESSION, RESET_SESSION } from './authActions';
import { GET_USER_SESSION } from '../queries';
import { useLazyQuery } from '@apollo/client';
import { SessionPayload } from '@/interfaces/index';
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /// check if the session exist and set the state acordingly
  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data.authentication?.email) {
        return setSession(data.authentication);
      }
    },
  });
  useEffect(() => {
    getUserSession();
  }, []);

  const initialState = {
    user: {},
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setSession = (user: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }) => {
    dispatch({
      type: SET_SESSION,
      payload: { user },
    });
  };
  const resetSession = () => {
    dispatch({
      type: RESET_SESSION,
      payload: {},
    });
  };
  let session: SessionPayload | {} = state;
  return (
    <AuthContext.Provider
      value={{
        session,
        resetSession,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
