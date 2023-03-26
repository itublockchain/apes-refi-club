import { Polybase } from '@polybase/client';
import { signMessage } from '@wagmi/core';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils.js';
import slugify from 'slugify';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const referance = db.collection('proposal');

export const createProposal = async (
  id: string,
  name: string,
  slug: string,
  createDate: number,
  owner: string,
  description: string,
  website: string,
  desiredAmount: number,
  account: string,
  endDate: number
) => {
  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signMessage({ message: data }),
    };
  });

  await referance.create([id, name, slug, owner, description, website, createDate, desiredAmount, account, endDate]);
};
