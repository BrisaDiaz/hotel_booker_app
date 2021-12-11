import '../styles/globals.css';
import { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../styles/theme';
import createEmotionCache from '../styles/createEmotionCache';
import { client } from '../lib/apollo';
import { ApolloProvider } from '@apollo/client';
import { WithLayoutPage } from '@/interfaces/index';
import AuthProvider from '../context/AuthProvider';
import ProgresBar from '@/components/ProgresBar';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache: any;
  Component: WithLayoutPage;
}

function MyApp(props: MyAppProps) {
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
              <ProgresBar />
            </>
          </ThemeProvider>
        </AuthProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

export default MyApp;
