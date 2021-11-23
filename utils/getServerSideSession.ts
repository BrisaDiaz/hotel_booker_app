import React from 'react';
import { GET_USER_SESSION } from '../queries';
import { client } from '@/lib/apollo';
import { SessionPayload } from '@/interfaces/index';

export async function getServerSideSession(): Promise<SessionPayload | null> {
  try {
    const { data } = await client.query({
      query: GET_USER_SESSION,
    });

    if (data.authentication) {
      return { user: data.authentication };
    }
    return null;
  } catch (error) {
    return null;
  }
}
