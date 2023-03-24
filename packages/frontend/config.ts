import { configureChains } from 'wagmi';
import { hardhat, goerli, optimism, mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
export const ALCHEMY_KEY = String(process.env.NEXT_PUBLIC_ALCHEMY_KEY);

let { chains, provider } = configureChains([mainnet], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);

export const ALCHEMY_MAINNET_BASEURL = 'https://eth-mainnet.g.alchemy.com/v2/';
export const BORED_APE_YACHT_CLUB_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d';
export const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
console.log(PRIVATE_KEY);
export const CHAINS = chains;
export const PROVIDER = provider;
