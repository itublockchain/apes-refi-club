import * as React from 'react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { createClient, WagmiConfig } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme';

import { useIsMounted } from '../hooks';
import { CHAINS, PROVIDER } from '@/config';

import { Layout } from '@/components';
import { ToastContainer } from 'react-toastify';

const { connectors } = getDefaultWallets({
  appName: 'apes-refi-club',
  chains: CHAINS,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors,
  provider: PROVIDER,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  const RainbowKitConfig: Partial<ThemeOptions> = {
    accentColor: '#585d6b',
    accentColorForeground: '#fff',
    borderRadius: 'medium',
    fontStack: 'system',
  };

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={{
          lightMode: lightTheme(RainbowKitConfig),
          darkMode: darkTheme(RainbowKitConfig),
        }}
        chains={CHAINS}
      >
        <ToastContainer />
        <NextHead>
          <title>Apes Refi Club</title>
        </NextHead>
        <Layout>
          <div className='h-full'>
            <Component {...pageProps} />
          </div>
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
