import { APES_REFI_CLUB_DAO_ABI, APES_REFI_CLUB_DAO_ADDRESS } from '@/config';
import { createProposal } from '@/utils';
import { BigNumber } from 'ethers';
import { isAddress, keccak256, toUtf8Bytes } from 'ethers/lib/utils.js';
import { FormEvent, useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import slugify from 'slugify';
import { useAccount, useContract, useSigner } from 'wagmi';
import Loader from './Loader';

function FundRequestForm() {
  const { data: signer } = useSigner();
  const apesRefiClubDaoContract = useContract({
    address: APES_REFI_CLUB_DAO_ADDRESS,
    abi: APES_REFI_CLUB_DAO_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (apesRefiClubDaoContract != null) {
      apesRefiClubDaoContract
        ?.MINIMUM_WAIT()
        .then((data: BigNumber) => {
          setConstantTime(Number(data));
        })
        .catch((err: any) => {});
    }
  }, [apesRefiClubDaoContract]);

  const [name, setName] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [desiredAmount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [constantTime, setConstantTime] = useState<number>();

  const owner = useAccount();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(website)) {
      toast.error('Invalid website url!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (desiredAmount! <= 0) {
      toast.error('Requested fund must be greater than 0!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (!isAddress(account!)) {
      toast.error('Invalid account!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (!owner) {
      toast.error('You must connect to with metamask to send a Request', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    const endDate = Math.floor(Number(new Date()) / 1000) + (constantTime ? constantTime : 7 * 24 * 60 * 60);
    const slug = slugify(name);
    const createDate = Math.floor(Number(new Date()) / 1000);
    const id = keccak256(
      toUtf8Bytes([name, slug, owner, description, website, createDate, desiredAmount, account, endDate].toString())
    );
    try {
      setLoading(true);
      const tx = await apesRefiClubDaoContract?.createProposal(account, id, BigNumber.from(desiredAmount));
      await tx.wait();
      await createProposal(id, name, slug, createDate, owner.address!, description, website, desiredAmount!, account, endDate);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full p-6'>
      {loading ? (
        <Loader loaderColor='blue' loaderText='Loading' />
      ) : (
        <div className='w-full h-full p-10 shadow-md'>
          <span className='font-bold text-lg'>Request funds for your decarbonization project</span>
          <form className='w-full p-2 flex flex-col flex-wrap' onSubmit={handleSubmit}>
            <div className=' flex flex-row flex-wrap justify-center'>
              <div className='w-full md:w-2/3'>
                <div className='flex flex-wrap -mx-3 mb-6'>
                  <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Name</label>
                    <input
                      value={name}
                      className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white'
                      type='text'
                      placeholder='My ReFi Project'
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className='w-full md:w-1/2 px-3'>
                    <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Website</label>
                    <input
                      value={website}
                      className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-1'
                      type='text'
                      placeholder='https://decarbonization-project.com'
                      required
                      onChange={(e) => {
                        setWebsite(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className='flex flex-wrap -mx-3 mb-6'>
                  <div className='w-full px-3'>
                    <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Project Account</label>
                    <input
                      value={account}
                      className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                      type='text'
                      placeholder='0xb58a6827fC242A2410845B200DEe9AeB75212d55'
                      onChange={(e) => {
                        setAccount(e.target.value);
                      }}
                    />
                    <p className='text-gray-600 text-xs italic mt-1 px-1'>Ape Coins will be sent to this account</p>
                  </div>
                </div>
                <div className='flex flex-wrap -mx-3 mb-2'>
                  <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                    <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                      Requested Fund Amount
                    </label>
                    <input
                      value={desiredAmount}
                      className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                      type='number'
                      required
                      onChange={(e) => {
                        setAmount(parseInt(e.target.value));
                      }}
                    />
                    <p className='text-gray-600 text-xs italic px-1 mt-1'>Requested fund amount in terms of ape coin</p>
                  </div>
                </div>
              </div>
              <div className='w-full md:w-1/3 h-full mb-6 md:mb-0 md:px-4'>
                <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>Description</label>
                <textarea
                  value={description}
                  rows={14}
                  className='block w-full text-sm bg-gray-200 h-7/12 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  placeholder='Describe your project in a few words'
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
            <div className='flex justify-center'>
              <button type='submit' className='w-2/3 h-10 shadow-sm bg-gray-200 hover:bg-gray-400 rounded-md border-0 mt-2'>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FundRequestForm;
