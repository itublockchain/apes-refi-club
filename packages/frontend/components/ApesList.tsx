import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from '@/components';

type ApesListProps = {
  apeImages: string[];
  setApeImages: Function;
  isControlOnList: boolean;
};

interface Attribute {
  trait_type: string;
  value: string;
}

interface MetaData {
  image: string;
  attributes: Attribute[];
}

export default function ApesList(props: ApesListProps) {
  const { apeImages, setApeImages, isControlOnList } = props;
  const MAX_LOAD_ONCE = 30;
  const [offset, setOffset] = useState<number>(MAX_LOAD_ONCE);

  const APE_YACHT_CLUB_BASE_URI = 'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';
  const MAX_APE_COUNT = 100;

  useEffect(() => {
    if (isControlOnList) {
      setApeImages([]);
      for (let apeIndex = 0; apeIndex < offset; apeIndex += 1) {
        axios.get(`${APE_YACHT_CLUB_BASE_URI}${apeIndex}`).then((data) => {
          const metaData: MetaData = data.data;
          const imageURI = metaData.image.split('/');
          const imageLink = `https://ipfs.io/ipfs/${imageURI[imageURI.length - 1]}`;
          setApeImages((prev: string[]) => [...prev, imageLink]);
          //console.log(imageLink);
        });
      }
    }
  }, []);

  const fetchMore = () => {
    setTimeout(() => {
      setOffset((prev) => prev + MAX_LOAD_ONCE);
      for (let apeIndex = offset; apeIndex < Math.min(offset + MAX_LOAD_ONCE, MAX_APE_COUNT); apeIndex += 1) {
        axios.get(`${APE_YACHT_CLUB_BASE_URI}${apeIndex}`).then((data) => {
          const metaData: MetaData = data.data;
          const imageURI = metaData.image.split('/');
          const imageLink = `https://ipfs.io/ipfs/${imageURI[imageURI.length - 1]}`;
          setApeImages((prev: string[]) => [...prev, imageLink]);
          //console.log(imageLink);
        });
        //setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className='w-full h-full bg-gray-200'>
      <InfiniteScroll
        dataLength={apeImages.length}
        next={fetchMore}
        hasMore={apeImages.length < MAX_APE_COUNT && isControlOnList}
        loader={<Loader loaderText='Loading' loaderColor='green-600' />}
      >
        <ul className='px-10 py-4 grid sm:grid-cols-3 gap-5 justify-items-center align-middle md:grid-cols-4 lg:grid-cols-5'>
          {apeImages.map((apeImage, index) => {
            return (
              <li key={index}>
                <div className='w-40 h-40 bg-black rounded-md border-2 border-black'>
                  <img src={apeImage} alt='' />
                </div>
              </li>
            );
          })}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
