import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Polybase } from '@polybase/client';
import { COLLECTION_CREATOR_PUB_KEY, NETWORK } from '../hardhat.config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { BigNumber } from 'ethers';

const db = new Polybase({
  defaultNamespace: `pk/${COLLECTION_CREATOR_PUB_KEY}/apes-refi-club`,
});

const carbonCollectionReferance = db.collection('carbonEmission');
const unverifiedCollectionReferance = db.collection('unverifiedCollection');

const ARC_NFT_ID = 0;

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployments = hre.deployments;
  const { deploy } = deployments;

  const signers = await hre.ethers.getSigners();

  const unverifieds = (await unverifiedCollectionReferance.get()).data;

  const merkleTreeValues = [];

  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signers[0].signMessage(data),
    };
  });

  console.log('Merkle proofs are creating...');
  const carbons = (await carbonCollectionReferance.get()).data;
  for (let i = 0; i < carbons.length; i += 1) {
    const id = carbons[i].data?.id;
    const carbonEmission: BigNumber = BigNumber.from(carbons[i].data?.correspondingApeCoinAmount);

    merkleTreeValues.push([Number(id), BigNumber.from(carbonEmission)]);
  }

  const tree = StandardMerkleTree.of(merkleTreeValues, ['uint', 'uint']);

  const apesRefiClubDao = await hre.ethers.getContract('ApesRefiClubDao');
  const apesRefiClubNFT = await hre.ethers.getContract('ApesRefiClubNFT');
  const mockApeCoin = await hre.ethers.getContract('MockApeCoin');

  const id = Number(carbons[ARC_NFT_ID].data?.id);
  const carbonDebt = BigNumber.from(carbons[ARC_NFT_ID].data?.correspondingApeCoinAmount);

  await mockApeCoin.mint(signers[1].address, carbonDebt);

  await mockApeCoin.connect(signers[1]).approve(apesRefiClubNFT.address, await mockApeCoin.balanceOf(signers[1].address));
  await apesRefiClubNFT.setDAOAddress(apesRefiClubDao.address);
  await apesRefiClubNFT.connect(signers[1]).payCarbonDebt(BigNumber.from(id), carbonDebt, tree.getProof(ARC_NFT_ID));

  console.log(id);
  console.log(await apesRefiClubNFT.tokenURI(BigNumber.from(id)));
  console.log(await mockApeCoin.balanceOf(apesRefiClubDao.address));
};

export default main;

export const tags = ['all'];
