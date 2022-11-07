/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";

import { NFTCardProps } from "../utils/types";

const NFTCard = ({ nft: { name, awsUrl, eventId }, userViewing }: NFTCardProps) => {
  const [isMinted, setIsMinted] = useState(false);

  const handleMintButtonClick = () => {
    setIsMinted(true);
  };

  return (
    <div className="border-solid border-2 border-black-opaque bg-black-opaque w-[160px] rounded-md pb-6">
      <img alt={name} src={awsUrl} />
      <div className="flex flex-col gap-4 mt-4 px-4">
        {userViewing ? (<div>
          <p className="font-medium mb-1 text-gray-500 text-base">Event</p>
          <p className="font-semibold text-white text-2xl">{eventId}</p>
        </div>) : (<div>
          <p className="font-medium mb-1 text-gray-500 text-base">Address</p>
          <p className="font-semibold text-white text-2xl">{name}</p>
        </div>)}

        <button
          className="bg-blue-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-red-700 rounded"
          onClick={handleMintButtonClick}
        >
          Burn
        </button>
      </div>
    </div>
  );
};

export default NFTCard;
