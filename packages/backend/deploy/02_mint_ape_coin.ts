import { BigNumber } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const DECIMAL_CONSTANT = BigNumber.from('1000000000000000000');
  const signers = await hre.ethers.getSigners();
  const MockApeCoin = await hre.ethers.getContract('MockApeCoin');

  for (let accountIndex = 1; accountIndex <= 10; accountIndex += 1) {
    MockApeCoin.mint(signers[accountIndex].address, DECIMAL_CONSTANT.mul(1000));
  }
  for (let accountIndex = 1; accountIndex <= 10; accountIndex += 1) {
    console.log(
      `${signers[accountIndex].address}'s ape coin balance is ${await MockApeCoin.balanceOf(signers[accountIndex].address)}`
    );
  }
};

export default main;

export const tags = ['all'];
