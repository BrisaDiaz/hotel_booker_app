import AuthContext from './AuthContext'
import {useContext} from 'react'

export function useAuth(){
  return  useContext(AuthContext)
}