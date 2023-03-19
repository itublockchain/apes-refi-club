import { useState, useEffect } from 'react';
import React from 'react';
import { ApesList } from '@/components';
import Image from 'next/image';
import apeYachtClubCover from '../public/apeYachtClubCover.png';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { ALCHEMY_KEY, ALCHEMY_MAINNET_BASEURL, BORED_APE_YACHT_CLUB_ADDRESS } from '@/config';

type ApesProps = {};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}

export default function ApesPage(props: ApesProps) {
  const [apeImages, setApeImages] = useState<string[]>([]);
  const [holders, setHolders] = useState<string[]>([]);
  const [holderAddressQuery, setHolderAddressQuery] = useState<string>('');
  const [isControlOnList, setIsControlOnList] = useState<boolean>(true);

  let filteredHolders: string[] = [];

  useEffect(() => {
    axios
      .get(`${ALCHEMY_MAINNET_BASEURL}${ALCHEMY_KEY}/getOwnersForCollection/?contractAddress=${BORED_APE_YACHT_CLUB_ADDRESS}`)
      .then((res) => {
        const data = res.data;
        setHolders(data.ownerAddresses);
      });
  }, []);

  const handleOnHolderAddressQueryChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setHolderAddressQuery(query);
    if (query.startsWith('0x') && query.length >= 3) {
      filteredHolders = holders.filter((holder: string) => {
        return holder.startsWith(query);
      });
      console.log(filteredHolders);
    } else {
      filteredHolders = [];
    }
  };

  const handleHolderQueryClick = () => {
    console.log(holders);
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }
  ) => {
    if (event.key == 'Enter') {
      event.target.blur();
      handleHolderQueryClick();
    }
  };

  return (
    <>
      <div className='bg-gray-200'>
        <div className='w-full h-96 '>
          <Image src={apeYachtClubCover} alt='' className='object-cover h-96' />
        </div>
        <div className='w-full h-16 bg-gray-200 sticky top-0 flex items-center justify-between px-16'>
          <div className='w-full flex'>
            <input
              className='w-1/2 h-8 border-black border-2 bg-white rounded-l-md px-2 border-r-0 shadow-md focus:outline-none'
              placeholder={`Search Bored Ape Yacht Club NFT's by holder addresses`}
              value={holderAddressQuery}
              onChange={handleOnHolderAddressQueryChange}
              onKeyDown={handleKeyDown}
            />
            <button type='button' className='w-8 h-8 bg-white -left-5 rounded-r-md border-2 border-black border-l-0 shadow-md'>
              <AiOutlineSearch className='float-right mr-2' />
            </button>
          </div>
        </div>
        <ApesList setApeImages={setApeImages} apeImages={apeImages} isControlOnList={isControlOnList} />
      </div>
    </>
  );
}
