import { Polybase } from '@polybase/client';
import { signMessage } from '@wagmi/core';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils.js';
import slugify from 'slugify';

const db = new Polybase({
  defaultNamespace:
    'pk/0xdea9b25b26a6c86dcbc601fcbb504ce1b0b57297afc7328fd25cdd9e8549530870c407826855af4cd92f4b1b343cde8a5a8f59e2eac510ed0bb41719baa7c02a/apes-refi-club',
});
const referance = db.collection('proposal');

export const createProposal = async (
  name: string,
  owner: string,
  description: string,
  website: string,
  endDate: number,
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
  const id = keccak256(
    toUtf8Bytes([name, slug, owner, description, website, endDate, createDate, desiredAmount, account].toString())
  );

  await referance.create([id, name, slug, owner, description, website, endDate, createDate, desiredAmount, account]);
};
