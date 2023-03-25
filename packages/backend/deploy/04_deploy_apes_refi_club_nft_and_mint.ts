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

const CARBON_COEFFICENT = 7;
const APE_COIN_PER_CARBON = 3;

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

  console.log('Old carbon emission collection is being deleted...');
  const carbons = (await carbonCollectionReferance.get()).data;
  for (let i = 0; i < carbons.length; i += 1) {
    const id = carbons[i].data?.id;
    await carbonCollectionReferance.record(id).call('del');
  }

  console.log('New carbon emission items creating...');
  for (let i = 0; i < unverifieds.length; i += 1) {
    const unverified = unverifieds[i].data;
    const txCount: number = Math.floor(Math.random() * 10);
    await carbonCollectionReferance.create([
      unverified.id,
      txCount * CARBON_COEFFICENT,
      txCount * CARBON_COEFFICENT * APE_COIN_PER_CARBON,
      txCount,
    ]);
    merkleTreeValues.push([Number(unverified.id), txCount * CARBON_COEFFICENT * APE_COIN_PER_CARBON]);
  }

  console.log('Merkle root is creating...');
  const tree = StandardMerkleTree.of(merkleTreeValues, ['uint', 'uint']);

  /*    
        address _baycAddress,
        address _ApeCoinAddress,
        bytes32 _merkleRoot,
        string memory _unverifiedCollectionName,
        string memory _verifiedCollectionName,
        string memory _collectionOwnerPubKey,
        string memory _collectionHeader
  */

  const mockBoredApeYachtClub = await deployments.get('MockBoredApeYachtClub');
  const mockApeCoin = await deployments.get('MockApeCoin');

  console.log('ApesRefiClubNFT is deploying...');
  await deploy('ApesRefiClubNFT', {
    from: signers[0].address,
    log: true,
    args: [
      mockBoredApeYachtClub.address,
      mockApeCoin.address,
      tree.root,
      'unverifiedCollection',
      'verifiedCollection',
      COLLECTION_CREATOR_PUB_KEY,
      'apes-refi-club',
    ],
  });
  const apesRefiClubNFT = await hre.ethers.getContract('ApesRefiClubNFT');
  const mockApeYachtClub = await hre.ethers.getContract('MockBoredApeYachtClub');

  let id = 1;
  for (let accountIndex = 1; accountIndex <= 3; accountIndex += 1) {
    let balance = Number(await mockApeYachtClub.balanceOf(signers[accountIndex].address));
    while (balance--) {
      await apesRefiClubNFT.safeMint(signers[accountIndex].address, BigNumber.from(id));
      console.log(await apesRefiClubNFT.tokenURI(BigNumber.from(id)), '\n');
      id += 1;
    }
  }
};

export default main;

export const tags = ['all'];
