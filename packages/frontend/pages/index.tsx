import Image from 'next/image';
import logo from '../public/logo.png';
import { useEffect, useState } from 'react';
import { newNft } from '@/utils/test';

export default function Home() {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const id = Number(new Date()) % 10000;
    newNft(id).then(() => {
      console.log(id);
    });
  }, []);

  return (
    <>
      {rendered ? (
        <div className='flex flex-row p-10 bg-[url(../public/logo.png)]'>
          <div className='transition p-5 m-5 backdrop-blur-md hover:backdrop-blur-xl rounded-3xl hover:scale-105'>
            <h1 className='text-center font-bold text-3xl font-mono'>Who Are We</h1>
            <p className='font-mono pt-5 text-justify'>
              This project aims to transform the negative environmental impact of NFTs into a force for nature. Our proposal is to
              incentivize Bored Ape Yacht Club (BAYC) token holders to pay for the carbon footprint their NFTs create, while also
              making a positive impact on the environment. To accomplish this, we will identify the addresses of BAYC NFT holders
              and determine the environmental impact of each NFT based on the amount of carbon emission involved and its monetary
              value. Next, we will design a contract that allows holders to pay for the carbon footprint of their NFTs, and in
              return, they will receive a badge on their NFT showing their contribution to ecological causes. Additionally, they
              will receive governance tokens, enabling them to manage a fund for environmental restoration. Our team plans to use
              Polybase for data storage and design a simple, user-friendly interface. We plan to use a push protocol to create fun
              and engaging notifications throughout the process. Our goal is to create a cross-chain project by deploying it in
              different locations and connecting them using Connext. In summary, through our project, we hope to make a tangible
              contribution to environmental sustainability by transforming NFTs that are harmful to nature into a force for good
              while simultaneously ensuring that these tokens benefit their holders through governance and other value-adding
              features.
            </p>
          </div>
          <div className='transition p-5 m-5 backdrop-blur-md hover:backdrop-blur-xl rounded-3xl hover:scale-105'>
            <h1 className='text-center font-bold text-3xl font-mono'>Technologies</h1>
            <p className='font-mono pt-5 text-justify'>
              Our project is built on a combination of technologies and methodologies to make it effective and efficient. The core
              technologies used in the project include blockchain, smart contracts, and web3 technologies. We are planning to use
              Ethereum or another blockchain to store and manage the underlying NFTs, while smart contracts will be developed to
              facilitate the payment of carbon credits or other means of funding ecological causes. Additionally, Connext will be
              used for cross-chain capabilities to link multiple deployable instances of the project. For data storage, we will
              utilize Polybase, a cloud-based data storage service built on top of Microsoft SQL Server that enables users to
              query data across multiple sources. The front-end part of the project, which includes the user interface, will be
              built on modern web development tools such as React, Next.js, and Tailwind CSS to create an intuitive and
              user-friendly interface. Our project will also leverage the Metamask browser extension to provide wallet and account
              access. Throughout the development process, we will prioritize user experience, security, and scalability to ensure
              the project’s effectiveness in promoting ecological causes. In terms of hacky tactics, we don’t anticipate any, as
              our team is committed to robust and best practices throughout our development process to ensure that our final
              product is reliable, secure, and effective.
            </p>
          </div>
        </div>
      ) : null}
      {rendered ? null : (
        <div
          className='bg-gray-500 w-full h-screen flex center justify-center items-center hover:cursor-pointer'
          onClick={() => setRendered(true)}
        >
          <div className='flex items-center justify-center flex-col'>
            <Image src={logo} alt='' className='animate-pulse w-2/5' />
            <span className='text-gray-300'>Click to continue</span>
          </div>
        </div>
      )}
    </>
  );
}
