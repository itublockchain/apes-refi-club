import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import {
  BORED_APE_YACHT_CLUB_ADDRESS,
  BORED_APE_YACHT_CLUB_ABI,
  APES_REFI_CLUB_NFT_ADDRESS,
  APES_REFI_CLUB_NFT_ABI,
  APE_COIN_ADDRESS,
  APE_COIN_ABI,
} from '@/config';
import { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import openSeaIcon from '../public/opensea_icon.png';
import Image from 'next/image';
import { classNames, listRecentVotes, fetchCarbonEmission } from '@/utils';
import { BigNumber } from 'ethers';
import { toast } from 'react-toastify';
import { MerkleContext } from './Layout';
import Loader from './Loader';

type ApeCardProps = {
  id: string | string[];
};

type Attribute = {
  trait_type: string;
  value: string;
};

type MetaData = {
  image: string;
  attributes: Attribute[];
};

type Vote = {
  id: string;
  vote: boolean;
  date: number;
  nftId: number;
  proposalId: string;
};

type CarbonEmission = {
  id: string;
  carbonEmission: number;
  correspondingApeCoinAmount: number;
  txCount: number;
};

const recentVotes = [
  {
    proposalHash: '0xf3a56d0a5dd3a3ea1dbe9ef85ea92a1137dbe10b90ec1aa6a96bffc44d33d359',
    voteDate: '11/02/2023',
    vote: true,
    totalVotes: '153',
  },
  {
    proposalHash: '0x68c1ebf03e3467e7a78aba930a6d33cbd6c46c6ffd5051723bd8531f809ac9fa',
    voteDate: '12/11/2023',
    vote: false,
    totalVotes: '5',
  },
  {
    proposalHash: '0x702c1554f1d5d9cac6e65b2accdd2bcc122aa9ff0a36a09f9f6434416a3c3744',
    voteDate: '05/05/2023',
    vote: true,
    totalVotes: '1758',
  },
  {
    proposalHash: '0x8dda7def571e6e35bb18e4a1e34d6d02292b932677d726ebf1938e557cec8cb0',
    voteDate: '10/10/2022',
    vote: false,
    totalVotes: '14',
  },
  {
    proposalHash: '0xf3a56d0a5dd3a3ea1dbe9ef85ea92a1137dbe10b90ec1aa6a96bffc44d33d359',
    voteDate: '11/02/2023',
    vote: false,
    totalVotes: '264',
  },
];

const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';
const ETHERSCAN_BASE = 'https://etherscan.io/tx/';
const BAYC_OPENSEA_BASE = 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/';
const DECIMAL_CONSTANT = BigNumber.from('1000000000000000000');

function ApeCard(props: ApeCardProps) {
  const { id } = props;
  const [holder, setHolder] = useState<string>();
  const [image, setImage] = useState<string>();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isVerified, setVerified] = useState<boolean>(false);
  const [carbonEmission, setCarbonEmission] = useState<CarbonEmission>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const merkleTree = useContext(MerkleContext);

  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();

  const boredApeYachtClubContract = useContract({
    abi: BORED_APE_YACHT_CLUB_ABI,
    address: BORED_APE_YACHT_CLUB_ADDRESS,
    signerOrProvider: provider,
  });

  const apesRefiClubNFTContract = useContract({
    address: APES_REFI_CLUB_NFT_ADDRESS,
    abi: APES_REFI_CLUB_NFT_ABI,
    signerOrProvider: signer,
  });

  const apeCoinContract = useContract({
    address: APE_COIN_ADDRESS,
    abi: APE_COIN_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (account.isConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [account]);

  useEffect(() => {
    if (id && apesRefiClubNFTContract != null) {
      try {
        apesRefiClubNFTContract
          ?.verifiedTokens(BigNumber.from(id))
          .then((data: boolean) => {
            console.log(data);
            setVerified(data);
          })
          .catch((err: any) => {});
      } catch (err) {
        console.log(err);
        toast.error('Failed to load verified data', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      try {
        boredApeYachtClubContract?.ownerOf(id).then((owner: string) => {
          setHolder(owner);
        });
      } catch (err) {
        toast.error('Failed to load owner', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      try {
        listRecentVotes(Number(id)).then((data) => {
          setVotes(data);
        });
      } catch {
        toast.error('Failed to load vote data', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      try {
        console.log(apesRefiClubNFTContract);
        apesRefiClubNFTContract
          .tokenURI(BigNumber.from(Number(id)))
          .then((res: any) => {
            axios
              .get(res)
              .then((data: any) => {
                const apeImage = data.data.image.split('/');
                setImage(`${IPFS_BASE_URL}${apeImage[apeImage.length - 1]}`);
              })
              .catch((err: any) => {});
          })
          .catch((err: any) => {});
      } catch {
        toast.error('Failed to load image from ipfs', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      try {
        fetchCarbonEmission(String(id)).then((data: CarbonEmission) => {
          setCarbonEmission(data);
        });
      } catch {
        toast.error('Failed to load vote data', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
  }, [id, apesRefiClubNFTContract]);

  const handleClick = async () => {
    if (isConnected) {
      setIsLoading(true);
      console.log(account.address);
      console.log(Number(id), carbonEmission?.correspondingApeCoinAmount);
      try {
        const tx0 = await apeCoinContract?.approve(
          APES_REFI_CLUB_NFT_ADDRESS,
          BigNumber.from(carbonEmission?.correspondingApeCoinAmount)
        );
        await tx0.wait();
        const tx1 = await apesRefiClubNFTContract?.payCarbonDebt(
          BigNumber.from(Number(id)),
          BigNumber.from(carbonEmission?.correspondingApeCoinAmount),
          merkleTree?.getProof(Number(id))
        );
        await tx1.wait();
        setVerified(true);
      } catch (err) {
        toast.error('Transaction failed', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please connect with metamask to pay', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col p-20'>
        <div className='flex flex-col md:flex-row gap-10'>
          <div className='w-96 rounded-md shadow-md'>
            <div className='h-72'>
              <img src={image} alt='' className='bg-white' />
            </div>
            <div className='h-24 flex items-center justify-center'>
              <a
                href={`${BAYC_OPENSEA_BASE}${id}`}
                className='h-12 w-11/12 flex items-center bg-slate-400 hover:bg-slate-500 p-2 text-2xl font-bold rounded-md'
              >
                See on:
                <Image src={openSeaIcon} alt='opensea_icon' className='object-contain w-3/5 ml-2' />
              </a>
            </div>
          </div>
          <div className='w-full h-96'>
            <div className='flex flex-col px-10 shadow-md rounded-lg h-96'>
              <span className='text-lg font-bold pt-10'>{`Bored Ape Yacht Club #${id}`}</span>
              <div className='flex flex-row p-4 text-gray-400 text-xl'>
                {isVerified ? 'Owned By: ' : 'Possible Owner: '}
                <div className='w-3' />
                <span className='text-xl text-gray-700'>{holder}</span>
              </div>
              {carbonEmission && (
                <div className='p-4 mb-2'>
                  <div className='h-36 bg-gray-100 rounded-md flex flex-col p-4'>
                    <div className='flex flex-row'>
                      <div className='h-10 w-1/2 text-md font-bold text-gray-600 flex justify-center items-center'>
                        Total Transactions:
                        <span className='text-md font-normal text-black px-1'>{carbonEmission.txCount}</span>
                      </div>
                      <div className='h-10 w-1/2 text-md font-bold text-gray-600 flex justify-center items-center'>
                        Total Carbon Emission:
                        <span className='text-md font-normal text-black px-1'>{carbonEmission.carbonEmission} Kg</span>
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <div className='h-10 w-1/2 text-md font-bold text-gray-600 flex justify-center items-center'>
                        Ape Amount:
                        <span className='text-md font-normal text-black px-1'>
                          {Number(BigNumber.from(carbonEmission.correspondingApeCoinAmount).div(DECIMAL_CONSTANT))} APE
                        </span>
                      </div>
                      <div className='h-10 w-1/2 text-md font-bold text-gray-600 flex justify-center items-center'>
                        USD Amount:
                        <span className='text-md font-normal text-black px-1'>
                          {Number(BigNumber.from(carbonEmission.correspondingApeCoinAmount).div(DECIMAL_CONSTANT))}$
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className='flex items-center justify-center'>
                <button
                  disabled={isVerified}
                  onClick={() => handleClick()}
                  className={classNames(
                    isVerified ? 'bg-green-500' : 'bg-amber-500 hover:bg-amber-600',
                    'h-10 border-none shadow-sm p-2 rounded-lg text-center align-middle w-1/4 transition-all'
                  )}
                >
                  {isLoading ? '...' : `${isVerified ? 'Carbon Debt Paid' : 'Pay Carbon Debt'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
        {recentVotes.length ? (
          <div className='h-52 mt-10 shadow-md rounded-lg p-4'>
            <div className='text-lg font-bold flex-col items-center'>
              Recent Votes:
              <div className='h-36 m-2 mb-0 overflow-hidden shadow-sm rounded-md'>
                <div className='h-36 overflow-scroll bg-white'>
                  {votes.map((recent, index) => {
                    return (
                      <div
                        key={index}
                        className={classNames(
                          recent.vote ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-red-100 hover:bg-red-200',
                          'h-10 shadow-sm flex text-gray-700 p-2 text-md font-normal items-center'
                        )}
                      >
                        <span className='text-slate-900 text-sm w-3/5'>{recent?.proposalId}</span>
                        <span className='text-slate-900 text-xs w-1/5 text-right'>{recent.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ApeCard;
