import { useState, useEffect } from 'react';
import React from 'react';
import { ApesList, Loader, ToggleButton } from '@/components';
import Image from 'next/image';
import apeYachtClubCover from '../public/ape_yacht_club_cover.png';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { ALCHEMY_KEY, ALCHEMY_MAINNET_BASEURL, BORED_APE_YACHT_CLUB_ADDRESS } from '@/config';
import abi from '../constants/boredApeYachtClubABI.json';
import { useContract, useProvider } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { classNames } from '@/utils';
import { ListBoxSort } from '@/components';

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
const MAX_APE_INDEX = 54;
const sortOptions = [{ name: 'ID' }, { name: 'Carbon Footprint' }, { name: 'Paid Amount' }];

export default function ApesPage(props: ApesProps) {
  const provider = useProvider();

  const [holders, setHolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [finalQuery, setFinalQuery] = useState<string>('');
  const [showFilteredHolders, setShowFilteredHolders] = useState<boolean>(true);
  const [apeIndexes, setApeIndexes] = useState<number[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<{ name: string }>(sortOptions[0]);

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
        try {
          fetchApesOfHolder(finalQuery).then((tokenIndexes: number[]) => {
            setApeIndexes(tokenIndexes);
          });
        } catch (err) {
          console.log(err);
        }
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
        <div className='w-full h-16 bg-gray-200 sticky top-0 flex items-center justify-between px-16 shadow-md'>
          <div className={classNames(filteredHolders.length ? 'mt-72' : 'mt-0', 'w-3/5')}>
            <div className='w-full flex'>
              <input
                className='w-full h-8  bg-white rounded-l-md px-2 border-r-0 shadow-md focus:outline-none'
                placeholder={`Search Bored Ape Yacht Club NFT's by holder addresses, opensea url, or id`}
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
                className='w-8 h-8 bg-white -left-5 rounded-r-md  shadow-md'
                onClick={() => {
                  handleSearchButtonClick();
                }}
              >
                <AiOutlineSearch className='float-right mr-2' />
              </button>
            </div>
            <div
              className={classNames(
                filteredHolders.length ? 'visible' : 'hidden',
                'w-11/12 h-72 overflow-hidden rounded-b-lg ml-1 mt-[3px]'
              )}
            >
              <ul className='w-full h-auto overflow-x-hidden overflow-y-scroll flex flex-col'>
                {showFilteredHolders &&
                  filteredHolders.map((holder, index) => {
                    //console.log(holder);
                    return (
                      <li key={index}>
                        <button
                          className='w-full h-8 bg-white  border-t-2 text-left text-gray-500 hover:bg-gray-300 px-2'
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
          </div>
          <ToggleButton enabled={toggle} setEnabled={setToggle} />
          <ListBoxSort sortOptions={sortOptions} selected={sortOption} setSelected={setSortOption} />
        </div>
        <ApesList apeIndexes={apeIndexes} sortOption={sortOption} />
      </div>
    </>
  );
}
