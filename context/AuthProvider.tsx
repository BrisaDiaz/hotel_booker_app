import React from 'react';
import { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import authReducer from './authReducer';
import { SET_SESSION, RESET_SESSION } from './authActions';
import { GET_USER_SESSION } from '../queries';
import { useQuery } from '@apollo/client';
import { SessionPayload } from '@/graphql/types/Auth';
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /// check if the session exist and set the state acordingly
  const { data, loading } = useQuery(GET_USER_SESSION);

  const initialState = {
    user: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setSession = (user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }) => {
    const userData = { ...user, id: parseInt(user.id) };

    dispatch({
      type: SET_SESSION,
      payload: { user: userData },
    });
  };
  const resetSession = () => {
    dispatch({
      type: RESET_SESSION,
      payload: {},
    });
  };

  useEffect(() => {
    if (data?.authentication?.email) {
      setSession(data.authentication);
    }
  }, [data]);
  let session: SessionPayload | { user: {} } = state;
  return (
    <AuthContext.Provider
      value={{
        loading: loading,
        session,
        resetSession,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
