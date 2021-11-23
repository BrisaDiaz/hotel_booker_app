import React from 'react'
import {GET_USER_SESSION} from '../queries';
import { client } from '@/lib/apollo';

export default function useSessionRequest(params:type) {
const getUserSession = async()=>{
const {data,error}=await client.query({
    query: GET_USER_SESSION,
  });
  if(data.authentication){
    return data.authentication
  }
  return {}
}
return getUserSession
}