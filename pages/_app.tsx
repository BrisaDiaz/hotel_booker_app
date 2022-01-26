import '../styles/globals.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { ReactNode } from 'react';

import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../styles/theme';
import createEmotionCache from '../styles/createEmotionCache';
import { client } from '../lib/apollo';
import { ApolloProvider } from '@apollo/client';

import AuthProvider from '../context/AuthProvider';
import LoadingBar from '@/components/layouts/LoadingBar';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <AuthProvider>
          <Head>
            <title>My page</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <>
              {getLayout(<Component {...pageProps} />)}
              <LoadingBar />
            </>
          </ThemeProvider>
        </AuthProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

export default MyApp;
