import '@nomiclabs/hardhat-waffle';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';

dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV || 'productions';
export const NETWORK: string = process.env.NETWORK || 'localhost';
export const COLLECTION_CREATOR_PUB_KEY = process.env.COLLECTION_CREATOR_PUB_KEY;
console.log(COLLECTION_CREATOR_PUB_KEY);

const defaultNetwork = 'localhost';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config = {
  solidity: '0.8.10',
  defaultNetwork,

  networks: {
    localhost: {
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    tokenOwner: 1,
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY as string,
    },
  },
};

export default config;
