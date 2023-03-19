import { useState, useEffect } from 'react';
import React from 'react';
import { ApesList, Loader } from '@/components';
import Image from 'next/image';
import apeYachtClubCover from '../public/apeYachtClubCover.png';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { ALCHEMY_KEY, ALCHEMY_MAINNET_BASEURL, BORED_APE_YACHT_CLUB_ADDRESS } from '@/config';
import abi from '../constants/boredApeYachtClubABI.json';
import { useContract, useProvider } from 'wagmi';
import { BigNumber, ethers } from 'ethers';

type ApesProps = {};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}
const APE_YACHT_CLUB_OPENSEA_BASE_URL = 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/';
const MAX_APE_INDEX = 9999;

export default function ApesPage(props: ApesProps) {
  const provider = useProvider();

  const [holders, setHolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [finalQuery, setFinalQuery] = useState<string>('');
  const [showFilteredHolders, setShowFilteredHolders] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apeIndexes, setApeIndexes] = useState<number[]>([]);

  const filteredHolders = holders.filter((holder) => {
    if (searchQuery.startsWith('0x') && searchQuery.length > 2) {
      return holder.startsWith(searchQuery.toLowerCase());
    }
  });

  const boredApeYachtClubContract = useContract({
    abi: (abi as any).abi,
    address: BORED_APE_YACHT_CLUB_ADDRESS,
    signerOrProvider: provider,
  });

  const fetchApesOfHolder = async (holder: string) => {
    const tokenIndexes: number[] = [];
    const balance = await boredApeYachtClubContract?.balanceOf(holder);
    for (let index = 0; index < Number(balance); index += 1) {
      tokenIndexes.push(Number(await boredApeYachtClubContract?.tokenOfOwnerByIndex(holder, BigNumber.from(index))));
    }
    return tokenIndexes;
  };

  const fulfillApeIndexes = () => {
    const fulfilledApeIndexes: number[] = [];
    for (let index = 0; index < MAX_APE_INDEX; index += 1) {
      fulfilledApeIndexes.push(index);
    }
    if (apeIndexes.length != MAX_APE_INDEX) {
      setApeIndexes(fulfilledApeIndexes);
    }
  };

  useEffect(() => {
    fulfillApeIndexes();
    axios
      .get(`${ALCHEMY_MAINNET_BASEURL}${ALCHEMY_KEY}/getOwnersForCollection/?contractAddress=${BORED_APE_YACHT_CLUB_ADDRESS}`)
      .then((res) => {
        const data = res.data;
        setHolders(data.ownerAddresses);
      });
  }, []);

  useEffect(() => {
    if (finalQuery) {
      if (ethers.utils.isAddress(finalQuery)) {
        setSearchQuery(finalQuery);
        fetchApesOfHolder(finalQuery).then((tokenIndexes: number[]) => {
          setApeIndexes(tokenIndexes);
        });
      } else if (finalQuery.startsWith(APE_YACHT_CLUB_OPENSEA_BASE_URL)) {
        const parsedOpenSeaUrl = finalQuery.split('/');
        setSearchQuery(parsedOpenSeaUrl[parsedOpenSeaUrl.length - 1]);
        setApeIndexes([Number(parsedOpenSeaUrl[parsedOpenSeaUrl.length - 1])]);
      } else if (Number(finalQuery) && Number(finalQuery) <= MAX_APE_INDEX && Number(finalQuery) >= 0) {
        //console.log(finalQuery);
        setSearchQuery(finalQuery);
        setApeIndexes([Number(finalQuery)]);
      }

      setFinalQuery('');
    }
  }, [finalQuery]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }
  ) => {
    if (event.key == 'Enter') {
      setShowFilteredHolders(false);
      if (filteredHolders.length > 0) {
        setFinalQuery(filteredHolders[0]);
      } else {
        setFinalQuery(searchQuery);
      }
    }
  };

  const handleSearchButtonClick = () => {
    setShowFilteredHolders(false);
    if (filteredHolders.length > 0) {
      setFinalQuery(filteredHolders[0]);
    } else {
      setFinalQuery(searchQuery);
    }
  };

  return (
    <>
      <div className='bg-gray-200 h-fit'>
        <div className='w-full h-96 '>
          <Image src={apeYachtClubCover} alt='' className='object-cover h-96' />
        </div>
        <div className='w-full h-16 bg-gray-200 sticky top-0 flex items-center justify-between px-16'>
          <div className='w-1/2 mt-72'>
            <div className='w-full flex'>
              <input
                className='w-full h-8 border-black border-2 bg-white rounded-l-md px-2 border-r-0 shadow-md focus:outline-none'
                placeholder={`Search Bored Ape Yacht Club NFT's by holder addresses`}
                value={searchQuery}
                onChange={(e) => {
                  fulfillApeIndexes();
                  setShowFilteredHolders(true);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                type='button'
                className='w-8 h-8 bg-white -left-5 rounded-r-md border-2 border-black border-l-0 shadow-md'
                onClick={() => {
                  handleSearchButtonClick();
                }}
              >
                <AiOutlineSearch className='float-right mr-2' />
              </button>
            </div>
            <ul className='w-full h-72 overflow-scroll px-1 flex flex-col rounded:lg border-black'>
              {showFilteredHolders &&
                filteredHolders.map((holder, index) => {
                  //console.log(holder);
                  return (
                    <li key={index}>
                      <button
                        className='w-full px-4 h-8 bg-white border-2 border-black border-t-0 text-left text-gray-500 hover:bg-gray-300'
                        onClick={() => {
                          setShowFilteredHolders(false);
                          setFinalQuery(holder);
                        }}
                      >
                        {holder}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className='w-1/12 h-8 bg-black'></div>
          <div className='w-1/12 h-8 bg-gray-600 text-center p-1'></div>
        </div>
        <ApesList apeIndexes={apeIndexes} />
      </div>
    </>
  );
}
