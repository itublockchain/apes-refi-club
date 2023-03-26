import { Header, Footer } from 'components';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getNetwork, GetNetworkResult, watchNetwork } from '@wagmi/core';
import { CHAINS, POLYBASE_NAMESPACE } from '../config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { Polybase } from '@polybase/client';
import { BigNumber } from 'ethers';

type LayoutProps = {};

type MerkleLeaf = {
  id: number;
  carbonEmission: BigNumber;
};

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});

const carbonCollectionReferance = db.collection('carbonEmission');

export const NetworkContext = createContext<boolean>(false);
export const MerkleContext = createContext<StandardMerkleTree<any> | undefined>(undefined);

function Layout(props: PropsWithChildren<LayoutProps>) {
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState<boolean>(false);
  const [network, setNetwork] = useState<GetNetworkResult>(() => getNetwork());
  const [merkleTree, setMerkleTree] = useState<StandardMerkleTree<any>>();
  const [merkleTreeValues, setMerkleTreeValues] = useState<MerkleLeaf[]>();

  useEffect(() => {
    try {
      const merkleTreeVals: MerkleLeaf[] = [];
      carbonCollectionReferance.get().then((data: any) => {
        const carbons = data.data;
        for (let i = 0; i < carbons.length; i += 1) {
          const id = carbons[i].data?.id;
          const carbonEmission: string = carbons[i].data?.correspondingApeCoinAmount;
          merkleTreeVals.push({ id: Number(id), carbonEmission: BigNumber.from(carbonEmission) });
        }
        setMerkleTreeValues(merkleTreeVals);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (merkleTreeValues?.length) {
      const treeVals = merkleTreeValues?.map((carbon: MerkleLeaf) => {
        return [carbon.id, carbon.carbonEmission];
      });
      treeVals.sort((a: Array<Number | BigNumber>, b: Array<Number | BigNumber>) => {
        return Number(a[0]) - Number(b[0]);
      });
      const tree = StandardMerkleTree.of([...treeVals], ['uint', 'uint']);
      setMerkleTree(tree);
    }
  }, [merkleTreeValues]);

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
        <NetworkContext.Provider value={isOnCorrectNetwork}>
          <MerkleContext.Provider value={merkleTree}>{props.children}</MerkleContext.Provider>
        </NetworkContext.Provider>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
