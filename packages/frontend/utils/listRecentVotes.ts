import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const collectionReference = db.collection('Vote');

export async function listRecentVotes(id: number) {
  const records = await collectionReference.where('nftId', '==', id).get();
  return records.data.map((data) => {
    return data.data;
  });
}
