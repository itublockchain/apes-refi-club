import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import axios from 'axios';
import { Polybase } from '@polybase/client';
import { BigNumber } from 'ethers';
import { COLLECTION_CREATOR_PUB_KEY, NETWORK } from '../hardhat.config';

const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';
let nftId = 0;

const db = new Polybase({
  defaultNamespace: `pk/${COLLECTION_CREATOR_PUB_KEY}/apes-refi-club`,
});

const unverifiedCollectionReferance = db.collection('unverifiedCollection');
const verifiedCollectionReferance = db.collection('verifiedCollection');

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const signers = await hre.ethers.getSigners();
  const mockApeYachtClub = await hre.ethers.getContract('MockBoredApeYachtClub');
  const validNfts: { image: string; id: number }[] = [];
  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signers[0].signMessage(data),
    };
  });
  /*
  console.log('Unverified collection is being deleted...');
  const unverifieds = (await unverifiedCollectionReferance.get()).data;
  for (let i = 0; i < unverifieds.length; i += 1) {
    const id = unverifieds[i].data?.id;
    await unverifiedCollectionReferance.record(id).call('del');
  }

  console.log('Verified collection is being deleted...');
  const verifieds = (await verifiedCollectionReferance.get()).data;
  for (let i = 0; i < verifieds.length; i += 1) {
    const id = verifieds[i].data?.id;
    await verifiedCollectionReferance.record(id).call('del');
  }

  console.log('New collection items are creating...');
  for (let accountIndex = 1; accountIndex <= 10; accountIndex += 1) {
    let balance = Number(await mockApeYachtClub.balanceOf(signers[accountIndex].address));
    while (balance > 0) {
      try {
        const metadata = (await axios.get(`${IPFS_BASE_URL}${APE_YACHT_CLUB_BASE}${nftId}`)).data;
        const image = metadata.image;
        validNfts.push({ image: image, id: validNfts.length });
        await unverifiedCollectionReferance.create([
          String(validNfts.length - 1),
          String(validNfts.length - 1),
          image,
          `Unverified #${validNfts.length}`,
        ]);
        await verifiedCollectionReferance.create([
          String(validNfts.length - 1),
          String(validNfts.length - 1),
          image,
          `Verified #${validNfts.length}`,
        ]);
        balance -= 1;
      } catch (err) {
      } finally {
        nftId += 1;
      }
    }
  }
*/
  console.log(validNfts);
};

export default main;

export const tags = ['all'];
