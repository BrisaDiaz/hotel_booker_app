import React from 'react';
import { useReducer, useEffect } from 'react';

import AuthContext from './AuthContext';
import authReducer from './authReducer';
import { SET_SESSION, RESET_SESSION } from './authActions';
import { GET_USER_SESSION } from '../queries';
import { useQuery } from '@apollo/client';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /// check if the session exist and set the state accordingly
  const { data } = useQuery(GET_USER_SESSION);
  const initialState = {
    loading: true,
    user: null,
    token: '',
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setSession = ({
    user,
    token,
  }: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      role: 'ADMIN' | 'USER';
    };
    token: string;
  }) => {
    const userData = { ...user };

    dispatch({
      type: SET_SESSION,
      payload: { loading: false, user: userData, token },
    });
  };
  const resetSession = () => {
    dispatch({
      type: RESET_SESSION,
      payload: null,
    });
  };

  useEffect(() => {
    if (data?.authentication?.user) {
      const { token, user } = data?.authentication;
      setSession({ token, user });
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        session: state,
        resetSession,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
