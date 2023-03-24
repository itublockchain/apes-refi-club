import { useDatabase } from "@/components";

export default function Home() {
  const reference = useDatabase("ApesRefiClubNFTs");

  return (
    <>
      <div className="p-10">
        <h1 className="font-bold text-5xl text-center">Apes ReFi Club</h1>
        <div className="py-5">
          <p>
            Welcome to Apes Refi Club, a unique project aimed at reducing carbon
            emissions in the cryptocurrency world by calculating the carbon
            footprints of Bored Ape Yacht Club (BAYC) NFTs. Our mission is to
            provide a sustainable future for all by using the power of
            blockchain technology to fight climate change.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-2xl pr-">How Does It Work?</h2>
          <hr></hr>
          <p className="py-5">
            Our project utilizes a variety of innovative technologies to achieve
            our goal. First and foremost, we use smart contracts to calculate
            the carbon footprint of each BAYC NFT. Then, we use Polybase to
            store the NFT metadata, ensuring that all data is kept safe and
            secure. To deploy our smart contracts, we utilize Scroll and
            Optimism, both of which are leading-edge solutions in the blockchain
            space.
          </p>
          <p className="pb-5">
            But our project doesn't stop there. Once we've calculated the carbon
            footprint of each NFT, we require an equal amount of money to
            activate greenified NFTs. This allows us to offset the carbon
            emissions of BAYC NFTs, effectively creating a greener future for
            all.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-2xl pr-">
            Which Technologies Did We Use?
          </h2>
          <hr></hr>
          <p className="py-5">
            Our project utilizes a variety of innovative technologies to achieve
            our goal. First and foremost, we use smart contracts to calculate
            the carbon footprint of each BAYC NFT. Then, we use Polybase to
            store the NFT metadata, ensuring that all data is kept safe and
            secure. To deploy our smart contracts, we utilize Scroll and
            Optimism, both of which are leading-edge solutions in the blockchain
            space.
          </p>
          <p className="pb-5">
            But our project doesn't stop there. Once we've calculated the carbon
            footprint of each NFT, we require an equal amount of money to
            activate greenified NFTs. This allows us to offset the carbon
            emissions of BAYC NFTs, effectively creating a greener future for
            all.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-2xl pr-">
            How Carbon Footprints Are Calculated?
          </h2>
          <hr></hr>
          <p className="py-5">
            We take a variety of factors into account, including the energy
            consumption required to create and maintain the NFT, as well as the
            emissions associated with the storage and transfer of the NFT. Our
            smart contracts are designed to automatically calculate these
            emissions, providing an accurate and reliable assessment of the
            carbon footprint of each NFT.
          </p>
        </div>
      </div>
    </>
  );
}
