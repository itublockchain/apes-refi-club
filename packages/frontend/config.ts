import { configureChains } from 'wagmi';
import { hardhat, goerli, optimism, mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import contracts from '@/contracts/hardhat_contracts.json';

let { chains, provider } = configureChains([hardhat], [publicProvider()]);

export const ALCHEMY_KEY = String(process.env.NEXT_PUBLIC_ALCHEMY_KEY);
export const ALCHEMY_MAINNET_BASEURL = 'https://eth-mainnet.g.alchemy.com/v2/';
export const POLYBASE_NAMESPACE = process.env.NEXT_PUBLIC_POLYBASE_NAMESPACE;
export const CHAINS = chains;
export const PROVIDER = provider;
export const CHAIN_ID = chains[0].id;

let mockApeCoin = (contracts as any)[CHAIN_ID][0].contracts.MockApeCoin;
export const APE_COIN_ADDRESS = mockApeCoin.address;
export const APE_COIN_ABI = mockApeCoin.abi;

let mockBoredApeYachtClub = (contracts as any)[CHAIN_ID][0].contracts.MockBoredApeYachtClub;
export const BORED_APE_YACHT_CLUB_ADDRESS = mockBoredApeYachtClub.address;
export const BORED_APE_YACHT_CLUB_ABI = mockBoredApeYachtClub.abi;

let apesRefiClubNFT = (contracts as any)[CHAIN_ID][0].contracts.ApesRefiClubNFT;
export const APES_REFI_CLUB_NFT_ADDRESS = apesRefiClubNFT.address;
export const APES_REFI_CLUB_NFT_ABI = apesRefiClubNFT.abi;

let apesRefiClubDao = (contracts as any)[CHAIN_ID][0].contracts.ApesRefiClubDao;
export const APES_REFI_CLUB_DAO_ADDRESS = apesRefiClubDao.address;
export const APES_REFI_CLUB_DAO_ABI = apesRefiClubDao.abi;
