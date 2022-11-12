/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount } from "wagmi";

import { CollectionCardProps } from "../utils/types";

const CollectionCard = ({
  collection: { id, name, nfts, creator, authorized },
}: CollectionCardProps) => {
  const router = useRouter();
  const [isMinted, setIsMinted] = useState(false);

  const handleMintButtonClick = () => {
    setIsMinted(true);
  };

  const handleViewNftsButtonClick = () => {
    router.push(`/events/${id}`);
  };

  const { address } = useAccount();

  return (
    <div className="bg-black-opaque w-[60vw] max-w-[900px] rounded-md p-10">
      <strong className="font-semibold text-white text-3xl">{name}</strong>
      <div className="bg-teal-500 h-[2px] mt-[6px] w-full" />
      <section className="flex justify-between mt-4 mb-8">
        <div>
          <img alt={name} src={nfts[0].awsUrl} className="h-16" />
        </div>
        <div>
          <p className="font-medium mb-1 text-gray-500 text-base">Creator</p>
          <p className="font-semibold text-white text-2xl">{(address === creator) ? "Yes" : "Not you"}</p>
        </div>
        <div>
          <p className="font-medium mb-1 text-gray-500 text-base">Authorized</p>
          <p className="font-semibold text-white text-2xl">{authorized ? "Yes" : "No"}</p>
        </div>
        <div>
          <p className="font-medium mb-1 text-gray-500 text-base">#Holders</p>
          <p className="font-semibold text-white text-2xl">{nfts.length}</p>
        </div>
        <div />
      </section>
      <div className="flex items-center gap-4 justify-center flex-wrap">
        <button
          className="rounded-md button-outlined"
          onClick={handleViewNftsButtonClick}
        >
          View
        </button>
      </div>

    </div >
  );
};

export default CollectionCard;
