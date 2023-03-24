import { FundRequestForm } from '@/components';
import { createProposal } from '@/utils';
import { useState } from 'react';

export default function DAOPage() {
  return (
    <>
      <div className='w-screen h-full flex flex-row justify-center p-8'>
        <FundRequestForm />
      </div>
    </>
  );
}
