import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const signers = await hre.ethers.getSigners();
  const MockApeCoin = await hre.ethers.getContract('MockApeCoin');

  for (let accountIndex = 1; accountIndex <= 3; accountIndex += 1) {
    MockApeCoin.mint(signers[accountIndex].address, 10000);
  }
  for (let accountIndex = 1; accountIndex <= 3; accountIndex += 1) {
    console.log(
      `${signers[accountIndex].address}'s ape coin balance is ${await MockApeCoin.balanceOf(signers[accountIndex].address)}`
    );
  }
};

export default main;

export const tags = ['all'];
