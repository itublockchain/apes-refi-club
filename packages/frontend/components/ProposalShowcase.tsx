import { useEffect, useState } from 'react';
import { listProposalRecords } from '@/utils';
import { ProposalCard } from '.';

type Proposal = {
  id: string;
  name: string;
  slug: string;
  owner: string;
  description: string;
  website: string;
  endDate: number;
  createDate: number;
  requestedAmount: number;
  account: string;
  executed: boolean;
};

function ProposalShowCase() {
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [recentProposals, setResentProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const actives: Proposal[] = [];
    const recents: Proposal[] = [];

    listProposalRecords().then((data: Proposal[]) => {
      for (let index = 0; index < data.length; index += 1) {
        const proposal = data[index];
        if (!proposal.executed) {
          actives.push(proposal);
        } else {
          recents.push(proposal);
        }
      }
      console.log(actives);
      setActiveProposals(actives);
      setResentProposals(recents);
    });
  }, []);

  useEffect(())

  return (
    <>
      <div className='flex flex-col w-full p-6'>
        <div className='mt-20'>
          <span className='font-bold text-2xl px-2 py-4'>Active Fund Requests</span>
          <div className='w-full mt-3 py-3 shadow-md'>
            {activeProposals.map((proposal: Proposal) => {
              return (
                <div className='w-full '>
                  <ProposalCard proposal={proposal} isActive={true} />
                </div>
              );
            })}
          </div>
        </div>
        <div className='mt-20'>
          <span className='font-bold text-2xl px-2 py-4'>Recent Fund Requests</span>
          <div className='w-full mt-3 py-3 shadow-md'>
            {recentProposals.map((proposal: Proposal) => {
              return (
                <div className='w-full '>
                  <ProposalCard proposal={proposal} isActive={false} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProposalShowCase;
