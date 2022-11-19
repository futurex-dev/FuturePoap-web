/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useAccount, useSigner, useContractRead, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { COLLECTIONS } from "../utils/constants";
import CollectionCard from "../components/collection-card";
import PoapCard from "../components/poap-card"
import { TypeAnimation } from 'react-type-animation';
import { BounceLoader } from 'react-spinners';
import { futurepoap_abi } from "../../futurepoap";
import { Result } from "ethers/lib/utils";


const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState(0);
  const { chain } = useNetwork();
  const router = useRouter();
  const futurepoapConfig = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi
  }
  const { data: poapBalance, error: balanceError, isLoading: balanceLoading } = useContractRead({
    ...futurepoapConfig,
    functionName: 'balanceOf',
    args: [address as string]
  })

  const handleNewEventButtonClick = () => {
    router.push("events/new");
  };

  const erroring = balanceError;
  const loading = balanceLoading;
  const waiting = balanceLoading || erroring;
  const indexArray = Array.from({ length: balance }, (item, index) => index);
  useEffect(() => {
    if (!balanceError && !balanceLoading && poapBalance) {
      setBalance((poapBalance as Result).toNumber());
    }
  }, [poapBalance, balanceError, balanceLoading]);
  if (!isConnected) {
    return (
      <div className="public-content">
        <img alt="futureX.xyz" className="h-60" src="/ticket.svg" />
        <br />
        <h1 className="text-center text-5xl text-white">
          <span className="font-bold font-mono text-transparent bg-clip-text bg-sky-400">
            <TypeAnimation sequence={['Permission', 2000, 'Permissionless', 5000]} wrapper="span" repeat={Infinity} cursor={true} />
          </span>
        </h1>
        <p className="italic text-center text-2xl text-white">
          Create, manage your on-chain events with FuturePoap
        </p>

      </div>
    );
  }
  return (
    <main className="flex flex-col items-center justify-center mt-16 min-h-[75vh] w-full">
      <div className="flex flex-col bg-black-opaque mb-10 rounded-md p-10 w-[90vw]">
        <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
          <p className="font-medium text-5xl text-white">Owned Poaps</p>
        </header>
        {waiting && <div className="flex items-center justify-center">
          {loading && <BounceLoader
            color={'#2C4565'}
            loading={true}
            size={80}
          />}
          {erroring && <p className="font-medium text-l text-red-300">{`Oops, unable to read from ${chain?.name}`}</p>}
        </div>}
        {(!waiting && (balance > 0)) && <div className="flex items-center justify-center flex-wrap gap-4 mb-20 mt-4">
          {indexArray.map((poapIndex: number) => (
            <PoapCard key={poapIndex} userAccount={address as string} poapIndex={poapIndex} />
          ))}
        </div>}
      </div>

      <div className="flex flex-col bg-black-opaque mb-10 rounded-md p-10 w-[90vw]">
        <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
          <p className="font-medium text-5xl text-white">Events</p>
          <button className="rounded-md	button-outlined" onClick={handleNewEventButtonClick}>New event</button>
        </header>
        <div className="flex flex-col items-center gap-7 mb-20">
          {(balance > 0) && indexArray.map((poapIndex) => (
            <CollectionCard key={poapIndex} poapIndex={poapIndex} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
