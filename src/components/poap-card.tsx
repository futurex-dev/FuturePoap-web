/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, useEffect } from "react";
import { BounceLoader } from 'react-spinners';
import { PoapCardProps, EventJSONData } from "../utils/types";
import { fetchIPFSJSON, getIPFSImage } from "../utils/helpers";
import { futurepoap_abi } from "../../futurepoap";
import { useContractRead, useAccount } from "wagmi";
import { Result } from "ethers/lib/utils";


const PoapCard = ({ userAccount, poapIndex }: PoapCardProps) => {
  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");

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

  const showToken = !readLoading && !readError && !eventError && !eventLoading;
  useEffect(() => {
    async function fetchJSON() {
      const eventJSON = (await fetchIPFSJSON((eventURI as Result).toString())) as EventJSONData;
      setEventName(eventJSON.data.name as string);
      setEventImage(getIPFSImage(eventJSON.data.image as string) as string);
    }
    if (!eventError && !eventLoading && eventURI) {
      fetchJSON();
    }
  }, [eventURI, eventError, eventLoading])

  return (
    <div className="border-solid border-2 border-black-opaque bg-black-opaque w-[200px] rounded-md pb-6">
      {showToken &&
        <div>
          <div className="flex items-center justify-center w-full mt-5">
            <img alt={eventName} src={eventImage} className="rounded-full border-2 border-gray-300 w-[150px]" />
          </div>
          <div className="flex flex-col gap-4 mt-4 px-4">
            <div>
              <p className="font-medium mb-1 text-gray-500 text-base">Event</p>
              <p className="font-semibold text-white text-l">{eventName}</p>
            </div>

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
