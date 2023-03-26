import { Polybase } from '@polybase/client';
import { signMessage } from '@wagmi/core';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const voteReferance = db.collection('vote');

export const createVote = async (proposalId: string, vote: boolean, nftId: string) => {
  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signMessage({ message: data }),
    };
  });
  await voteReferance.create([`${nftId}/${proposalId}`, vote, Math.floor(Number(new Date()) / 1000), Number(nftId), proposalId]);
};
