/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useAccount, useSigner, useContract } from "wagmi";
import { useRouter } from "next/router";
import { COLLECTIONS } from "../utils/constants";
import CollectionCard from "../components/collection-card";
import NFTCard from "../components/nft-card"

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();

  const handleNewEventButtonClick = () => {
    router.push("events/new");
  };

  if (!isConnected) {
    return (
      <div className="public-content">
        <img alt="futureX.xyz" className="h-60" src="/ticket.svg" />
        <br />
        <h1 className="text-center text-5xl text-white">
          <a className="font-bold text-transparent bg-clip-text bg-sky-400">Permissionless</a> Poaps
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
        <div className="flex items-center justify-center flex-wrap gap-4 mb-20 mt-4">
          {COLLECTIONS[0].nfts?.map((nft) => (
            <NFTCard key={nft.id} nft={nft} userViewing={true} />
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-black-opaque mb-10 rounded-md p-10 w-[90vw]">
        <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
          <p className="font-medium text-5xl text-white">Events</p>
          <button className="rounded-md	button-outlined" onClick={handleNewEventButtonClick}>New event</button>
        </header>
        <div className="flex flex-col items-center gap-7 mb-20">
          {COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
