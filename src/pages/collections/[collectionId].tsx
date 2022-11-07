/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { NFTCard } from "../../components";
import { COLLECTIONS } from "../../utils/constants";

const Collection: NextPage = () => {
  const { isConnected } = useAccount();
  const {
    query: { collectionId },
    push,
  } = useRouter();

  const collection = COLLECTIONS.find(
    (collection) => String(collection.id) === collectionId
  );

  useEffect(() => {
    if (!isConnected) {
      push("/");
    }
  }, [isConnected, push]);

  if (!isConnected) return null;

  return (
    <main className="flex flex-col items-center justify-center mt-16 w-full">
      <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
        <p className="font-medium text-4xl text-white">
          <Link href="/" passHref>
            <a className="opacity-70 hover:opacity-100 cursor-pointer">
              Events
            </a>
          </Link>{" "}
          / {collection?.name}{" "}
        </p>
        <button className="button-secondary">Pop Poap!</button>
      </header>
      <p className="font-medium text-lg text-white ml-16 mr-auto">
        Created by <a className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-700">{collection?.creator}</a>
      </p>
      <p className="font-medium text-lg text-white ml-16 mr-auto">
        Total {collection?.nfts?.length} Poaps
      </p>
      <div className="flex items-center justify-center flex-wrap gap-4 mb-20 mt-4">
        {collection?.nfts?.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </main>
  );
};

export default Collection;
