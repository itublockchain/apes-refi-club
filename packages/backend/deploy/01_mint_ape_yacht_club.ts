import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (NETWORK === 'localhost') {
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    const mockApeYachtClub = await hre.ethers.getContract('MockApeYachtClub');

    const account1 = signers[1];
    for (let accountIndex = 1; accountIndex <= 3; accountIndex += 1) {
      for (let nftCount = 1; nftCount <= accountIndex; nftCount += 1) {
        await mockApeYachtClub.safeMint(signers[accountIndex].address);
      }
    }
    for (let accountIndex = 1; accountIndex <= 3; accountIndex += 1) {
      console.log(
        `${signers[accountIndex].address}'s ape balance is ${await mockApeYachtClub.balanceOf(signers[accountIndex].address)}`
      );
    }
  }
};

export default main;

export const tags = ['all'];
