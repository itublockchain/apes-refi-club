import { ApeCard, Loader } from '@/components';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
const IPFS_BASE_URL = 'https://ipfs.io/ipfs/';
const APE_YACHT_CLUB_BASE = 'QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';

export default function Ape() {
  const router = useRouter();
  const { id } = router.query;
  let image;

  useEffect(() => {}, [id]);

  return (
    <>
      <div className='w-screen h-screen'>
        {id ? (
          <div>
            <ApeCard id={id} />
          </div>
        ) : (
          <Loader loaderColor='blue' loaderText='Loading' />
        )}
      </div>
    </>
  );
}
