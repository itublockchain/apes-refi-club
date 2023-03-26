import { Polybase } from '@polybase/client';
import { POLYBASE_NAMESPACE } from '@/config';

const db = new Polybase({
  defaultNamespace: POLYBASE_NAMESPACE,
});
const collectionReference = db.collection('carbonEmission');

export async function fetchCarbonEmission(id: string) {
  const records: any = await collectionReference.where('id', '==', id).get();
  return records.data[0].data;
}
