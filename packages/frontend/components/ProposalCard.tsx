import { classNames } from '@/utils';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
const hdate = require('human-date');

type Proposal = {
  id: string;
  name: string;
  slug: string;
  owner: string;
  description: string;
  website: string;
  endDate: number;
  createDate: number;
  desiredAmount: number;
  account: string;
};

type ProposalCardProps = {
  proposal: Proposal;
  isActive: boolean;
};

function ProposalCard(props: ProposalCardProps) {
  const { proposal, isActive } = props;
  const votePercantage = Math.floor(Math.random() * 100);
  const [selected, setSelected] = useState<string>();

  return (
    <div className={classNames(isActive ? 'py-2' : 'py-0.5', 'w-full px-4')}>
      <div className='mx-auto w-full rounded-lg shadow-sm bg-gray-50'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={classNames(
                  'w-full h-10 p-1 rounded-lg relative text-left text-sm font-medium text-gray-900 focus:outline-none hover:shadow-md bg-gray-200'
                )}
              >
                <div className='flex justify-between items-center'>
                  <div className='w-full relative h-8 flex flex-row justify-between'>
                    <div
                      className={classNames(votePercantage < 99.9 && 'rounded-r-none', 'rounded-lg h-8 bg-green-200 float-right')}
                      style={{ width: `${votePercantage}%` }}
                    />
                    <div
                      className={classNames(votePercantage >= 0.01 && 'rounded-l-none', 'rounded-lg h-8 bg-red-200')}
                      style={{ width: `${99.9 - votePercantage}%` }}
                    />
                  </div>
                  <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 mr-2`} />
                </div>
                <div className='w-11/12 h-8 absolute -translate-y-8 px-2 flex flex-row justify-between items-center'>
                  <div className='h-full w-1/2 text-md font-bold text-gray-600 flex items-center'>
                    <span className='text-sm font-normal text-black'>{proposal.name}</span>
                  </div>
                  <div className='h-full w-1/4 text-md font-bold text-gray-600 flex items-center'>
                    {'Amount: '}
                    <span className='text-sm font-normal text-black px-1'>{proposal.desiredAmount}</span>
                  </div>
                  {isActive ? (
                    <div className='h-full w-1/4 text-md font-bold text-gray-600 flex items-center'>
                      {'End Date: '}
                      <span className='text-sm font-normal text-black px-1'>
                        {hdate.prettyPrint(new Date(proposal.endDate * 1000), { showTime: true })}
                      </span>
                    </div>
                  ) : (
                    <div className='h-full text-md font-bold text-gray-600 flex items-center'>{'Ended'}</div>
                  )}
                </div>
              </Disclosure.Button>
              <Transition
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500 flex flex-row justify-between items-start'>
                  <div className='flex flex-col w-5/6 overflow-hidden p-1'>
                    <div className='h-full text-md font-bold text-gray-600 flex items-center'>
                      {'Website: '}
                      <a href={proposal.website} className='text-sm font-normal text-black px-1 hover:text-blue-500'>
                        {proposal.website}
                      </a>
                    </div>
                    <div className='h-full text-md font-bold text-gray-600 flex items-center'>
                      {'Account: '}
                      <span className='text-sm font-normal text-black px-1'>{proposal.account}</span>
                    </div>
                    <div className='h-full text-md font-bold text-gray-600 flex flex-col items-left overflow-scroll'>
                      {'Description: '}
                      <span className='text-sm font-normal text-black px-1'>{proposal.description}</span>
                    </div>
                  </div>
                  {isActive ? (
                    <div className='w-1/6 h-full p-2 flex flex-col'>
                      <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 w-full'>
                        ARC NFT ID
                      </label>
                      <input
                        value={selected}
                        className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-center'
                        type='number'
                        max={9999}
                        min={0}
                        onChange={(e) => setSelected(e.target.value)}
                      />
                      <div className='flex flex-row px-3 py-1'>
                        <button className='w-1/2 h-10 bg-green-200 hover:bg-green-300 rounded rounded-r-none'>For</button>
                        <button className='w-1/2 h-10 bg-red-200 hover:bg-red-300 rounded rounded-l-none'>Against</button>
                      </div>
                    </div>
                  ) : (
                    <div className='w-1/6 h-10 flex justify-center items-center'>
                      <div className='flex flex-row text-gray-600 font-semibold text-md items-center justify-center'>
                        For
                        <span className='text-black font-normal text-md px-1'>12</span>
                      </div>
                      /
                      <div className='flex flex-row-reverse text-gray-600 font-semibold text-md items-center justify-center'>
                        Against
                        <span className='text-black font-normal text-md px-1'>123</span>
                      </div>
                    </div>
                  )}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default ProposalCard;
