import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (NETWORK === 'localhost') {
    const deployments = hre.deployments;
    const { deploy } = deployments;
    const { deployer } = await hre.getNamedAccounts();

    console.log(`Deployer address is: ${deployer}`);

    await deploy('MockApeYachtClub', {
      from: deployer,
      log: true,
    });
  }
};

export default main;

export const tags = ['all'];
