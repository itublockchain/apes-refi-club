import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ApesCard, Loader } from '@/components';

type ApesListProps = {
  apeIndexes: number[];
  sortOption: { name: string };
};

type ApeData = {
  id: number;
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

const MAX_LOAD_ONCE = 20;
const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';

export default function ApesList(props: ApesListProps) {
  const { apeIndexes, sortOption } = props;
  const [offset, setOffset] = useState(Math.min(MAX_LOAD_ONCE, apeIndexes.length ? apeIndexes.length : MAX_LOAD_ONCE));

  const [apesData, setApesData] = useState<ApeData[]>([]);

  const initializeApes = async () => {
    const initialApes: ApeData[] = [];
    for (let index = 0; index < offset; index += 1) {
      try {
        const metadata: MetaData = (await axios.get(`${IPFS_BASE_URL}${APE_YACHT_CLUB_BASE}${apeIndexes[index]}`)).data;
        const image = metadata.image.split('/');
        const apeImage = `${IPFS_BASE_URL}${image[image.length - 1]}`;
        initialApes.push({ id: apeIndexes[index], image: apeImage, paidCarbonPercantage: Math.floor(Math.random() * 100) });
      } catch (err) {
        console.log(err);
      }
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
        const newApe: ApeData = { id: apeIndexes[index], image: apeImage, paidCarbonPercantage: Math.floor(Math.random() * 100) };
        setApesData((prev: ApeData[]) => [...prev, newApe]);
      });
    }
    setOffset(Math.min(offset + MAX_LOAD_ONCE, apeIndexes.length));
  };

  return (
    <div className='w-full h-full bg-[#e6f2cc]'>
      <InfiniteScroll
        dataLength={apesData.length}
        next={fetchMore}
        hasMore={apesData.length < apeIndexes.length}
        loader={
          <div className='w-40 h-40'>
            <Loader loaderColor='blue' loaderText='Loading' />
          </div>
        }
      >
        <ul className='px-10 py-3 grid sm:grid-cols-3 gap-10 justify-items-center align-middle md:grid-cols-4 lg:grid-cols-5'>
          {apesData.map((ape, index) => {
            //console.log(index);
            return (
              <li key={index}>
                <ApesCard ape={ape} />
              </li>
            );
          })}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
