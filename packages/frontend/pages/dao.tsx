import { ProposalShowCase, FundRequestForm } from '@/components';
import { APES_REFI_CLUB_DAO_ABI, APES_REFI_CLUB_DAO_ADDRESS } from '@/config';
import { useEffect } from 'react';
import { useContract, useSigner } from 'wagmi';

export default function DAOPage() {
  return (
    <>
      <div className='w-screen h-full flex flex-col justify-center items-center p-8'>
        <ProposalShowCase />
        <FundRequestForm />
      </div>
    </>
  );
}
