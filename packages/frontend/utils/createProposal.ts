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
  name: string,
  owner: string,
  description: string,
  website: string,
  desiredAmount: number,
  account: string
) => {
  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signMessage({ message: data }),
    };
  });
  const slug = slugify(name);
  const createDate = Math.floor(Number(new Date()) / 1000);
  const id = keccak256(toUtf8Bytes([name, slug, owner, description, website, createDate, desiredAmount, account].toString()));

  await referance.create([id, name, slug, owner, description, website, createDate, desiredAmount, account]);
};
