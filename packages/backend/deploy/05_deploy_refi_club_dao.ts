import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployments = hre.deployments;
  const { deploy } = deployments;
  const { deployer } = await hre.getNamedAccounts();

  const mockApeCoin = await deployments.get('MockApeCoin');
  const apesRefiClubNFT = await deployments.get('ApesRefiClubNFT');

  console.log('ApesRefiClubDao is deploying...');
  await deploy('ApesRefiClubDao', {
    from: deployer,
    log: true,
    args: [apesRefiClubNFT.address, mockApeCoin.address],
  });
};

export default main;

export const tags = ['all'];
