import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NETWORK } from '../hardhat.config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployments = hre.deployments;
  const { deploy } = deployments;
  const { deployer } = await hre.getNamedAccounts();

  console.log(`Deployer address is: ${deployer}`);
  await deploy('MockApeCoin', {
    from: deployer,
    log: true,
  });
  await deploy('MockBoredApeYachtClub', {
    from: deployer,
    log: true,
  });
};

export default main;

export const tags = ['all'];
