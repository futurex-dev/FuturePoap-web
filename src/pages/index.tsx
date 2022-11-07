/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useConnectModal, ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { COLLECTIONS } from "../utils/constants";
import CollectionCard from "../components/collection-card";
import NFTCard from "../components/nft-card"

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (!isConnected) {
    return (
      <div className="public-content">
        <img alt="futureX.xyz" className="h-40" src="/ticket.svg" />
        <h1 className="text-center text-5xl text-white">
          <a className="font-bold">Permissionless</a> Poaps
        </h1>
        <p className="italic text-center text-2xl text-white">
          Create, mint, & view FuturePoaps
        </p>

      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center mt-16 min-h-[75vh] w-full">
      <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
        <p className="font-medium text-5xl text-white">Owned Poaps</p>
      </header>
      <div className="flex items-center justify-center flex-wrap gap-4 mb-20 mt-4">
        {COLLECTIONS[0].nfts?.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
      <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
        <p className="font-medium text-5xl text-white">Events</p>
        <button className="button-outlined">New event</button>
      </header>
      <div className="flex flex-col gap-7 mb-20">
        {COLLECTIONS.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </main>
  );
};

export default Home;
