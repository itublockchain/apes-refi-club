import { BigNumber } from 'ethers';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const mockApeYachtClub = await hre.ethers.getContract('MockBoredApeYachtClub');

  for (let accountIndex = 1; accountIndex <= 10; accountIndex += 1) {
    for (let nftCount = 1; nftCount <= accountIndex; nftCount += 1) {
      console.log((accountIndex * (accountIndex - 1)) / 2 + nftCount - 1);
      await mockApeYachtClub.safeMint(
        signers[accountIndex].address,
        BigNumber.from((accountIndex * (accountIndex - 1)) / 2 + nftCount - 1)
      );
    }
  }
  for (let accountIndex = 1; accountIndex <= 10; accountIndex += 1) {
    console.log(
      `${signers[accountIndex].address}'s ape nft balance is ${await mockApeYachtClub.balanceOf(signers[accountIndex].address)}`
    );
  }
};

export default main;

export const tags = ['all'];
