/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, useEffect } from "react";
import { BounceLoader } from 'react-spinners';
import { PoapCardProps, EventJSONData } from "../utils/types";
import { fetchIPFSJSON, getIPFSImage } from "../utils/helpers";
import { futurepoap_abi } from "../../futurepoap";
import { useContractRead, useAccount } from "wagmi";
import { defaultIcon } from "../utils/web3";
import { emojiAvatarForEvent } from "../utils/emoji-avatar";
import { Result } from "ethers/lib/utils";


const PoapCard = ({ userAccount, poapIndex }: PoapCardProps) => {
  const [tokenIndex, setTokenIndex] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("");

  const handleBurnButtonClick = () => {
    alert("Burn not already yet");
  };

  const callingEvent = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi,
    functionName: "eventOfOwnerByIndex",
    args: [userAccount, poapIndex]
  }


  const { data: indexEvent, error: readError, isLoading: readLoading } = useContractRead({
    ...callingEvent,
  })

  const callingURI = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi,
    functionName: "eventMetaURI",
    args: [indexEvent]
  }

  const { data: eventURI, error: eventError, isLoading: eventLoading } = useContractRead({
    ...callingURI,
  })

  const callingToken = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi,
    functionName: "tokenOfOwnerByIndex",
    args: [userAccount, poapIndex]
  }

  const { data: tokenID, error: tokenError, isLoading: tokenLoading } = useContractRead({
    ...callingToken,
  })

  const showToken = !readLoading && !readError && !eventError && !eventLoading && !tokenLoading && !tokenError && eventName && eventImage;
  console.log("Token is", tokenID);
  useEffect(() => {
    async function fetchJSON() {
      const [eventJSON, getIPFSError] = (await fetchIPFSJSON((eventURI as Result).toString())) as [EventJSONData, Boolean];
      if (getIPFSError) {
        setEventName(`[${indexEvent}]`);
        setEventImage(defaultIcon);
        setAvatarEmoji(emojiAvatarForEvent((indexEvent as Result).toNumber()).emoji);
        return;
      }
      setEventName(eventJSON.data.name as string);
      setEventImage(getIPFSImage(eventJSON.data.image as string) as string);
    }
    if (!eventError && !eventLoading && eventURI) {
      fetchJSON();
    }
  }, [eventURI, eventError, eventLoading, indexEvent])

  useEffect(() => {
    if (!tokenLoading && !tokenError && tokenID) {
      setTokenIndex((tokenID as Result).toNumber());
    }
  }, [tokenID, tokenError, tokenLoading])

  return (
    <div className="border-solid border-2 border-black-opaque bg-black-opaque w-[200px] rounded-md pb-6">
      {showToken &&
        <div>
          <div className="flex items-center justify-center w-full mt-5">
            {!avatarEmoji && <img alt={eventName} src={eventImage} className="rounded-full border-2 border-gray-300 w-32 h-32" />}
            {avatarEmoji &&
              <div className={`flex items-center justify-center w-32 h-32 rounded-full border-2 border-gray-300 bg-[#ff9a23]`}>
                <p className="text-5xl">{avatarEmoji}</p>
              </div>}
          </div>
          <div className="flex flex-col gap-4 mt-4 px-4">
            <div>
              <p className="font-medium mb-1 text-gray-500 text-base">Event</p>
              <p className="font-semibold text-white text-l break-words">{eventName}</p>
            </div>

            <a className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-700 rounded" href={`https://testnets.opensea.io/assets/goerli/${process.env.NEXT_PUBLIC_contract_ADDRESS}/${tokenIndex}`}>View NFT</a>
            <button
              className="bg-blue-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-red-700 rounded"
              onClick={handleBurnButtonClick}
            >
              Burn
            </button>
          </div>
        </div>
      }
      {!showToken && <div className="flex items-center justify-center mt-5">
        <BounceLoader
          color={'#2C4565'}
          loading={true}
          size={40}
        />
      </div>}
    </div>
  );
};

export default PoapCard;
