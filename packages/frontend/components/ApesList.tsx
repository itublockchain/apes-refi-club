import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ApeCard, Loader } from '@/components';

type ApesListProps = {
  apeIndexes: number[];
  sortOption: { name: string };
};

type ApeData = {
  image: string;
  paidCarbonPercantage: number;
};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}

const MAX_LOAD_ONCE = 30;
const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';

export default function ApesList(props: ApesListProps) {
  const { apeIndexes, sortOption } = props;
  let offset = Math.min(apeIndexes.length, MAX_LOAD_ONCE);

  const [apesData, setApesData] = useState<ApeData[]>([]);

  const initializeApes = async () => {
    const initialApes: ApeData[] = [];
    for (let index = 0; index < offset; index += 1) {
      const metadata: MetaData = (await axios.get(`${IPFS_BASE_URL}${APE_YACHT_CLUB_BASE}${apeIndexes[index]}`)).data;
      const image = metadata.image.split('/');
      const apeImage = `${IPFS_BASE_URL}${image[image.length - 1]}`;
      initialApes.push({ image: apeImage, paidCarbonPercantage: Math.floor(Math.random() * 100) });
    }
    return initialApes;
  };

  useEffect(() => {
    initializeApes().then((initialApes: ApeData[]) => {
      setApesData(initialApes);
    });
  }, [apeIndexes]);

  useEffect(() => {
    console.log(sortOption);
  }, [sortOption]);

  const fetchMore = () => {
    for (let index = offset; index < Math.min(offset + MAX_LOAD_ONCE, apeIndexes.length); index += 1) {
      axios.get(`${IPFS_BASE_URL}${APE_YACHT_CLUB_BASE}${apeIndexes[index]}`).then((response) => {
        const metadata = response.data;
        const image = metadata.image.split('/');
        const apeImage = `${IPFS_BASE_URL}${image[image.length - 1]}`;
        const newApe: ApeData = { image: apeImage, paidCarbonPercantage: Math.floor(Math.random() * 100) };
        setApesData((prev: ApeData[]) => [...prev, newApe]);
      });
    }
    offset = Math.min(offset + MAX_LOAD_ONCE, apeIndexes.length);
  };

  return (
    <div className='w-full h-full bg-gray-200'>
      <InfiniteScroll
        dataLength={apesData.length}
        next={fetchMore}
        hasMore={apesData.length < apeIndexes.length}
        loader={<Loader loaderColor='blue' loaderText='Loading' />}
      >
        <ul className='px-10 py-3 grid sm:grid-cols-3 gap-10 justify-items-center align-middle md:grid-cols-4 lg:grid-cols-5'>
          {apesData.map((ape, index) => {
            //console.log(index);
            return (
              <li key={index}>
                <ApeCard ape={ape} />
              </li>
            );
          })}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
