import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const collectionReference = db.collection('proposal');

export async function listProposalRecords() {
  const records = await collectionReference.get();
  return records.data.map((data) => {
    return data.data;
  });
}
