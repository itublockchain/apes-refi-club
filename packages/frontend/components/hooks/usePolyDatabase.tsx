import { Polybase } from "@polybase/client";
import { usePolybase } from "@polybase/react";

export default function usePolyDatabase() {
  const polybase = usePolybase();

  const db = new Polybase({
    defaultNamespace:
      "pk/0x974a72dc7f7fb65684e848611d20d5078918e7244c6d11c7e3bca44e021b33878a57269d2a3131f068d4531c764d2a4cda18216977fd385afcd5ddbc6a890ae0/ApesRefiClubNFTs",
  });
  const collectionReference = db.collection("ApesRefiClubNFTs");

  async function createNFT() {
    const recordData = await collectionReference.create([
      "02",
      "Second NFT",
      "Image URI",
      "Description",
      0,
    ]);
  }

  async function callFunc() {
    collectionReference.record("01").call("setPercentage", [10])
  }

  async function listRecords() {
    const record = await collectionReference.record("02").get();
    console.log(record.data.image);
  }

  return (
    <>
      <div>
        <button
          onClick={() => {
            createNFT();
          }}
        >
          Create NFT
        </button>
        <button
          onClick={() => {
            listRecords();
          }}
        >
          List Records
        </button>
        <button
            onClick={() => {
                callFunc()
            }}>
            Function Call
        </button>
      </div>
    </>
  );
}
