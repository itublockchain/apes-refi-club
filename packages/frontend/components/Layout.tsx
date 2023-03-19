import { Header, Footer } from 'components';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getNetwork, GetNetworkResult, watchNetwork } from '@wagmi/core';
import { CHAINS } from '../config';

type LayoutProps = {};

export const NetworkContext = createContext<boolean>(false);

function Layout(props: PropsWithChildren<LayoutProps>) {
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState<boolean>(false);

  const [network, setNetwork] = useState<GetNetworkResult>(() => getNetwork());

  useEffect(() => {
    network.chains.forEach((chain) => {
      if (chain == network.chain) {
        setIsOnCorrectNetwork(true);
        return;
      }
    });
    setIsOnCorrectNetwork(false);
  }, [network.chain?.id]);

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='flex-grow bg-green-5'>
        <NetworkContext.Provider value={isOnCorrectNetwork}>{props.children}</NetworkContext.Provider>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
