import { ProposalShowCase, FundRequestForm } from '@/components';
import { createProposal } from '@/utils';
import { useState } from 'react';

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
