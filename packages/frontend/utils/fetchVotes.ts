import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const collectionReference = db.collection('vote');

export async function fetchVotes(id: string) {
  const records: any = await collectionReference.where('proposalId', '==', id).get();
  return records.data.map((data: any) => {
    return data.data;
  });
}
