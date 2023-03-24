import { Polybase } from "@polybase/client";

export const usePolyDatabase = (collection: string) => {
    const db = new Polybase({
        defaultNamespace:
          "pk/0x974a72dc7f7fb65684e848611d20d5078918e7244c6d11c7e3bca44e021b33878a57269d2a3131f068d4531c764d2a4cda18216977fd385afcd5ddbc6a890ae0/ApesRefiClubNFTs",
      });
      const collectionReference = db.collection(collection);

      return collectionReference;
}