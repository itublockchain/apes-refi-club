import { configureChains } from 'wagmi';
import { hardhat, goerli, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

let { chains, provider } = configureChains([hardhat, goerli, optimism], [publicProvider()]);

export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
export const ALCHEMY_MAINNET_BASEURL = 'https://eth-mainnet.g.alchemy.com/v2/';
export const BORED_APE_YACHT_CLUB_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';

export const CHAINS = chains;
export const PROVIDER = provider;
