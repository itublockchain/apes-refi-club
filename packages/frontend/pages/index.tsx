import Image from "next/image";
import logo from "../public/logo.png";
import { useEffect, useState } from "react";
import { newNft } from "@/utils/test";
import backgroundImage from "../public/background.png";
import ape1 from "../public/ape1.png";
import ape2 from "../public/ape2.png";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-[#085D70] to-[#3AFFBF] w-full h-screen relative">
        <div className="absolute top-[200px] left-[65px] text-[#08423D] w-[684px]">
          <h1 className="font-bold text-[40px] drop-shadow-md">
            APE REFI CLUB
          </h1>
          <p className="text-[33px] mt-[30px] drop-shadow-md">
            We give the right to manage the fund formed in return for the
            payment of the amount corresponding to the carbon emission created
            by the NFTs in their hands, up to a merge.
          </p>
          <button className="drop-shadow-xl w-[350px] h-[70px] font-semibold text-white text-[32px] bg-[#0F766E] rounded-2xl mt-[50px]">
            Learn about us!
          </button>
        </div>
        <Image
          src={ape1}
          alt="Ape NFT"
          className="w-[300px] absolute right-[90px] top-[40px] animate-custom-bounce"
        />
        <Image
          src={ape2}
          alt="Ape NFT"
          className="w-[300px] absolute right-[300px] bottom-[40px] animate-custom-bounce"
        />
      </div>
      <div className="bg-lime-50 w-full h-screen relative">
        <div className="bg-lime-400 blur-[150px] w-[300px] h-[300px] absolute top-[200px] right-[300px]"></div>
        <div className="bg-lime-400 blur-[100px] w-[120px] h-[120px] absolute top-[450px] left-[250px]"></div>
        <div className="bg-lime-400 blur-[100px] w-[120px] h-[120px] absolute top-[250px] left-[450px]"></div>

        <div className="absolute m-[75px] text-[#08423D]">
          <h1 className="font-bold text-[48px]">Bored Ape NFT Footprint</h1>
          <div className="bg-[#CBDB78] w-[380px] pl-[11px] rounded-md">
            <p>0x21e91485af0273251A53d1e9643d5531C1E4FCdc</p>
          </div>
          <div className="flex my-[75px]">
            <div className="pr-[30px] text-center">
              <h2 className="text-[48px]">6000k</h2>
              <p>CO2 Emissions KG</p>
            </div>
            <div className="pr-[30px] text-center">
              <h2 className="text-[48px]">6000k</h2>
              <p>Gas used Units</p>
            </div>
            <div className="text-center">
              <h2 className="text-[48px]">60000</h2>
              <p>Transactions </p>
            </div>
          </div>
          <div className="w-[500px]">
            <h3 className="text-[36px] font-semibold">How we calculated?</h3>
            <p className="text-[25px]">
              We give the right to manage the fund formed in return for the
              payment of the amount corresponding to the carbon emission created
              by the NFTs in their hands.
            </p>
          </div>
        </div>
        <div className="text-[#08423D] drop-shadow-xl absolute w-[450px] h-[550px] bg-white bottom-[75px] right-[100px] p-[50px] rounded-2xl">
          <h2 className="text-[48px]">6789</h2>
          <p className="font-bold">Carbon credits paid</p>
          <p className="w-[250px] pt-[10px]">
            We give the right to manage the fund formed in return for the
            payment
          </p>
          <div className="bg-[#D9D9D9] w-[269px] h-[82px] text-left bg-gray-500 text-[33px] align-middle rounded-xl mt-[80px] p-[13px] pl-[20px]">
            70.000 APE
          </div>
          <div className="bg-[#D9D9D9] w-[269px] h-[82px] text-left bg-gray-500 text-[33px] align-middle rounded-xl mt-[30px] p-[13px] pl-[20px]">
            70.000$
          </div>
        </div>
      </div>
      <div className="relative bg-gradient-to-b from-[#3AFFBF] to-[#085D70] w-full h-screen text-[#08423D]">
        <div className="absolute w-[700px] h-[200px] top-[100px] left-[75px]">
          <h2 className="text-[40px] font-bold mb-[30px]">Our Vision</h2>
          <p className="text-[28px] font-medium">
            We give the right to manage the fund formed in return for the
            payment of the amount corresponding to the carbon emission created
            by the NFTs in their hands, up to a merge.
          </p>
        </div>
        <div className="absolute w-[700px] h-[200px] bottom-[150px] right-[75px]">
          <h2 className="text-[40px] font-bold mb-[30px]">Which technologies did we use?</h2>
          <p className="text-[28px] font-medium">
            We give the right to manage the fund formed in return for the
            payment of the amount corresponding to the carbon emission created
            by the NFTs in their hands, up to a merge.
          </p>
        </div>
      </div>
    </>
  );
}
