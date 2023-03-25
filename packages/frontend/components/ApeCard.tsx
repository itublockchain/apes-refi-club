import { useContract, useProvider } from 'wagmi';
import abi from '../constants/boredApeYachtClubABI.json';
import { BORED_APE_YACHT_CLUB_ADDRESS } from '@/config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import openSeaIcon from '../public/opensea_icon.png';
import Image from 'next/image';
import { classNames } from '@/utils';

type ApeCardProps = {
  id: string | string[];
};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}
const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';
const ETHERSCAN_BASE = 'https://etherscan.io/tx/';
const BAYC_OPENSEA_BASE = 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/';

const supporters = [
  {
    txHash: '0xa3d807ec8d9ce5340b4b439ad0c9df5d3f33bb57c50086ee585b6c5fb03e09e8',
    from: '0xf8a11e7bc7c9306e821f07b60b5e6d2075d82ff4',
    amount: 11,
  },
  {
    txHash: '0x8dda7def571e6e35bb18e4a1e34d6d02292b932677d726ebf1938e557cec8cb0',
    from: '0x885164ca615b2b565963bbdc03e9f94d4903c2b8',
    amount: 983475,
  },
  {
    txHash: '0x8dda7def571e6e35bb18e4a1e34d6d02292b932677d726ebf1938e557cec8cb0',
    from: '0x885164ca615b2b565963bbdc03e9f94d4903c2b8',
    amount: 734,
  },
  {
    txHash: '0xc0e1b95984cfdbc1bd12439942e072e49c92c229d7bcda2af31e27cf077ae821',
    from: '0x150f9023811eae01facb671f8f25bb29af70fce8',
    amount: 13,
  },
  {
    txHash: '0x702c1554f1d5d9cac6e65b2accdd2bcc122aa9ff0a36a09f9f6434416a3c3744',
    from: '0xf2bdc8db1cd2e771ebb281f54292aa4c9cedc2bc',
    amount: 7,
  },
  {
    txHash: '0xf3a56d0a5dd3a3ea1dbe9ef85ea92a1137dbe10b90ec1aa6a96bffc44d33d359',
    from: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
    amount: 784536,
  },
  {
    txHash: '0x68c1ebf03e3467e7a78aba930a6d33cbd6c46c6ffd5051723bd8531f809ac9fa',
    from: '0x27899fface558bde9f284ba5c8c91ec79ee60fd6',
    amount: 2766,
  },
];

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

function ApeCard(props: ApeCardProps) {
  const { id } = props;
  const [holder, setHolder] = useState<string>();
  const [image, setImage] = useState<string>();

  const provider = useProvider();
  const boredApeYachtClubContract = useContract({
    abi: (abi as any).abi,
    address: BORED_APE_YACHT_CLUB_ADDRESS,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (id) {
      boredApeYachtClubContract?.ownerOf(id).then((owner: string) => {
        console.log(owner);
        setHolder(owner);
      });
      if (id) {
        axios.get(`${IPFS_BASE_URL}${APE_YACHT_CLUB_BASE}${id}`).then((response) => {
          const metadata: MetaData = response.data;
          const apeImage = metadata.image.split('/');
          setImage(`${IPFS_BASE_URL}${apeImage[apeImage.length - 1]}`);
        });
      }
    }
  }, [id]);

  useEffect(() => {
    console.log(holder);
  }, [holder]);
  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col p-20'>
        <div className='flex flex-row gap-10'>
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
            <div className='flex flex-col px-10 shadow-md rounded-lg'>
              <span className='text-lg font-bold pt-10'>{`Bored Ape Yacht Club #${id}`}</span>
              <div className='flex flex-row p-4 text-gray-400 text-xl'>
                {'Owned By: '}
                <div className='w-3' />
                <span className='text-xl text-gray-700'>{holder}</span>
              </div>
              <div className='h-64 p-2 font-bold'>
                {'Supporters:'}
                <div className='shadow-sm rounded-md h-48 overflow-hidden font-normal p-2 bg-gray-100'>
                  <div className='h-full overflow-y-scroll'>
                    {supporters.map((support) => {
                      return (
                        <a href={`${ETHERSCAN_BASE}${support.txHash}`} className='flex flex-col hover:bg-gray-200 p-2 rounded-md'>
                          <div className='text-gray-500 text-md w-full'>
                            {'TX Hash: '}
                            <span className='text-gray-800 text-sm'>{support.txHash}</span>
                          </div>
                          <div className='flex flex-row h-5'>
                            <span className='text-gray-500 text-sm w-2/3 px-4'>
                              {'From: '}
                              <span className='text-gray-800 text-xs'>{support.from}</span>
                            </span>
                            <span className='text-gray-500 text-sm w-1/3'>
                              {'Amout: '}
                              <span className='text-gray-800 text-xs'>{support.amount}</span>
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-52 mt-10 shadow-md rounded-lg p-4'>
          {recentVotes.length && (
            <div className='text-lg font-bold flex-col items-center'>
              Recent Votes:
              <div className='h-36 m-2 mb-0 overflow-hidden shadow-sm rounded-md'>
                <div className='h-36 overflow-scroll bg-white'>
                  {recentVotes.map((recent) => {
                    return (
                      <div
                        className={classNames(
                          recent.vote ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-red-100 hover:bg-red-200',
                          'h-10 shadow-sm flex text-gray-700 p-2 text-md font-normal items-center'
                        )}
                      >
                        <span className='text-slate-900 text-sm w-3/5'>{recent.proposalHash}</span>
                        <span className='text-slate-900 text-xs w-1/5'>Total Votes: {recent.totalVotes}</span>
                        <span className='text-slate-900 text-xs w-1/5 text-right'>{recent.voteDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApeCard;
