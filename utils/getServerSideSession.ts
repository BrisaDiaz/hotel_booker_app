import React from 'react'
import {GET_USER_SESSION} from '../queries';
import { client } from '@/lib/apollo';

export  async function getServerSideSession() {
try {
  const {data,error}=await client.query({
    query: GET_USER_SESSION,
  });

  if(data.authentication){
    return ({user:data.authentication})
  }
    return {}
} catch (error) {
    return {}
}

}