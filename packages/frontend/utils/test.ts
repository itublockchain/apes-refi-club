import { Polybase } from '@polybase/client';
import { signMessage } from '@wagmi/core';

const db = new Polybase({
  defaultNamespace:
    'pk/0xbbe8a114ef58376c987dc865573a2760fa4fa320b0231fb17c8a0e49be9b4531dec2c08ca10e5f6d19ff8727bb4cd5d0b471c3dd3079c014e09164bddff70843/test-nft',
});
const collectionReference = db.collection('testCollection');

export async function newNft(id: number) {
  db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await signMessage({ message: data }),
    };
  });
  await collectionReference.create([String(id), 'test#0', 'ipfs://QmVP1tqb9jf6XCkZZXkqGfTAtS8KwXHKHvkePh62zyL65n', '0xa']);
}
