import { useState, useEffect } from 'react';
import React from 'react';
import { ApesList } from '@/components';
import Image from 'next/image';
import apeYachtClubCover from '../public/apeYachtClubCover.png';
import { AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { ALCHEMY_KEY, ALCHEMY_MAINNET_BASEURL, BORED_APE_YACHT_CLUB_ADDRESS } from '@/config';
import abi from '../constants/boredApeYachtClubABI.json';
import { useContract, useProvider } from 'wagmi';
import { BigNumber } from 'ethers';

type ApesProps = {};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}
const APE_YACHT_CLUB_BASE_URI = 'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';

export default function ApesPage(props: ApesProps) {
  const provider = useProvider();
  const boredApeYachtClubContract = useContract({
    abi: (abi as any).abi,
    address: BORED_APE_YACHT_CLUB_ADDRESS,
    signerOrProvider: provider,
  });

  const [apeImages, setApeImages] = useState<string[]>([]);
  const [holders, setHolders] = useState<string[]>([]);
  const [filteredHolders, setFilteredHolders] = useState<string[]>([]);
  const [holderAddressQuery, setHolderAddressQuery] = useState<string>('');
  const [isControlOnList, setIsControlOnList] = useState<boolean>(true);
  const [isFilteredHoldersOpen, setIsFilteredHoldersOpen] = useState<boolean>(false);

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
    const query = event.target.value.toLowerCase();
    setHolderAddressQuery(query);
    setFilteredHolders([]);
    if (query.startsWith('0x') && query.length >= 3) {
      setIsFilteredHoldersOpen(true);
      holders.forEach((holder) => {
        if (holder.startsWith(query)) {
          setFilteredHolders((prev: string[]) => [...prev, holder]);
        }
      });
    } else {
      setIsFilteredHoldersOpen(false);
      setIsControlOnList(true);
    }
  };

  const handleHolderQueryClick = () => {
    //console.log(filteredHolders[0]);
    setIsFilteredHoldersOpen(false);
    if (filteredHolders.length == 1) {
      setHolderAddressQuery(filteredHolders[0]);
    }
    boredApeYachtClubContract?.balanceOf(filteredHolders[0]).then((data: BigNumber) => {
      setApeImages([]);
      if (Number(data) > 0) {
        setIsControlOnList(false);
        for (let index = 0; index < Number(data); index += 1) {
          boredApeYachtClubContract.tokenOfOwnerByIndex(filteredHolders[0], BigNumber.from(index)).then((data: BigNumber) => {
            axios.get(`${APE_YACHT_CLUB_BASE_URI}${Number(data)}`).then((data) => {
              const metaData: MetaData = data.data;
              const imageURI = metaData.image.split('/');
              const imageLink = `https://ipfs.io/ipfs/${imageURI[imageURI.length - 1]}`;
              setApeImages((prev: string[]) => [...prev, imageLink]);
              //console.log(imageLink);
            });
          });
        }
      } else {
        setIsControlOnList(true);
        setApeImages([]);
      }
    });
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }
  ) => {
    if (event.key == 'Enter') {
      handleHolderQueryClick();
    }
  };

  return (
    <>
      <div className='bg-gray-200 h-fit'>
        <div className='w-full h-96 '>
          <Image src={apeYachtClubCover} alt='' className='object-cover h-96' />
        </div>
        <div className='w-full h-16 bg-gray-200 sticky top-0 flex items-center justify-between px-16'>
          <div className='w-full mt-72'>
            <div className='w-full flex'>
              <input
                className='w-1/2 h-8 border-black border-2 bg-white rounded-l-md px-2 border-r-0 shadow-md focus:outline-none'
                placeholder={`Search Bored Ape Yacht Club NFT's by holder addresses`}
                value={holderAddressQuery}
                onChange={handleOnHolderAddressQueryChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type='button'
                className='w-8 h-8 bg-white -left-5 rounded-r-md border-2 border-black border-l-0 shadow-md'
                onClick={handleHolderQueryClick}
              >
                <AiOutlineSearch className='float-right mr-2' />
              </button>
            </div>
            <div className='w-full h-72 overflow-scroll px-1 flex flex-col rounded:lg border-black'>
              {isFilteredHoldersOpen &&
                filteredHolders.map((holder) => {
                  return (
                    <>
                      <button
                        className='w-1/2 px-4 h-8 bg-white border-2 border-black border-t-0 text-left text-gray-500 hover:bg-gray-300'
                        onClick={() => {
                          setHolderAddressQuery(holder);
                          handleHolderQueryClick();
                          //setFilteredHolders([]);
                        }}
                      >
                        {holder}
                      </button>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
        <ApesList setApeImages={setApeImages} apeImages={apeImages} isControlOnList={isControlOnList} />
      </div>
    </>
  );
}
