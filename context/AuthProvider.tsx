import { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import authReducer from './authReducer'
import { SET_SESSION, RESET_SESSION } from './authActions';
import {GET_USER_SESSION} from '../queries';
import {useLazyQuery} from '@apollo/client';
export default function AuthProvider({children}) {


/// check if the session exist and set the state acordingly
 const [getUserSession] =useLazyQuery(GET_USER_SESSION,{
     fetchPolicy: 'no-cache',
 onCompleted:(data=>{
   if(data.authentication?.email){
  return setSession(data.authentication)
   }
  })  })
useEffect(() => {

  getUserSession()
}, [])



const initialState = {
  user:{}
}
const [state, dispatch] = useReducer(authReducer, initialState)



const setSession = (user)=>{

  dispatch({
    type:SET_SESSION,
    payload:{user},
  })
}
const resetSession = ()=>{
  dispatch({
    type:RESET_SESSION,
    payload:{},
  })
}

return (
 <AuthContext.Provider value={{
   session:state,
resetSession,
setSession
 }}>
{children}
  </AuthContext.Provider>

)
}
