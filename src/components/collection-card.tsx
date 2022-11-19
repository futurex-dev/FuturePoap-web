/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useContractReads, useContractRead } from "wagmi";
import { BounceLoader } from 'react-spinners';
import { futurepoap_abi } from "../../futurepoap";
import { CollectionCardProps, EventJSONData } from "../utils/types"
import { fetchIPFSJSON, getIPFSImage } from "../utils/helpers";
import { defaultIcon } from "../utils/web3";
import { Result } from "ethers/lib/utils";
import { emojiAvatarForEvent } from "../utils/emoji-avatar";

const CollectionCard = ({ poapIndex }: CollectionCardProps) => {
  const router = useRouter();
  const [eventId, setEventId] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("");
  const [eventInfo, setEventInfo] = useState({
    holders: 0,
    authorized: false,
    creator: false,
  });

  const { address } = useAccount();
  const callingEvent = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi,
  }

  const { data: eventIdLoad, error: idError, isLoading: idLoading } = useContractRead({
    ...callingEvent,
    functionName: "eventOfOwnerByIndex",
    args: [address, poapIndex]
  })

  useEffect(() => {
    if (!idError && !idLoading && eventIdLoad) {
      setEventId(eventIdLoad.toNumber());
    }
  }, [eventIdLoad, idError, idLoading]);

  const { data: indexEvent, error: readError, isLoading: readLoading } = useContractReads({
    contracts: [
      {
        ...callingEvent,
        functionName: "balanceOfEvent",
        args: [eventId]
      },
      {
        ...callingEvent,
        functionName: "isEventCreator",
        args: [eventId, address]
      },
      {
        ...callingEvent,
        functionName: "authorized",
        args: [eventId]
      },
      {
        ...callingEvent,
        functionName: "eventMetaURI",
        args: [eventId]
      }
    ]
  })
  useEffect(() => {
    async function fetchJSON() {
      const [eventJSON, getIPFSError] = (await fetchIPFSJSON(((indexEvent as Result[])[3]).toString())) as [EventJSONData, Boolean];
      if (getIPFSError) {
        setEventName(`[${eventId}]`);
        setEventImage(defaultIcon);
        setAvatarEmoji(emojiAvatarForEvent(eventId).emoji);
        return;
      }
      setEventName(eventJSON.data.name as string);
      setEventImage(getIPFSImage(eventJSON.data.image as string) as string);
    }
    if (eventId && !readLoading && !readError && indexEvent) {
      fetchJSON();
      // console.log("Here", readLoading, readError, indexEvent);
      setEventInfo({
        holders: indexEvent[0].toNumber(),
        creator: Boolean(indexEvent[1]),
        authorized: Boolean(indexEvent[2]),
      });
    }
  }, [eventId, readLoading, readError, indexEvent])
  const handleViewNftsButtonClick = () => {
    router.push(`/events/${eventId}`);
  };

  const showToken = !readLoading && !readError && indexEvent && eventId && eventName && eventImage;
  return (
    <div className="bg-black-opaque w-[60vw] min-w-[300px] max-w-[900px] rounded-md p-5">
      {!showToken && <div className="flex items-center justify-center mt-4">
        <BounceLoader
          color={'#2C4565'}
          loading={true}
          size={40}
        />
      </div>}
      {showToken && (
        <div>
          <strong className="font-semibold text-white text-3xl">{eventName}</strong>
          <div className="bg-teal-500 h-[2px] mt-[6px] w-full" />
          <section className="flex justify-between mt-4 mb-8">
            <div>
              {!avatarEmoji && <img alt={eventName} src={eventImage} className="h-16 rounded-full border-2 border-gray-300" />}
              {avatarEmoji &&
                <div className={`flex items-center justify-center h-16 w-16 rounded-full border-2 border-gray-300 bg-[#ff9a23]`}>
                  <p className="text-5xl">{avatarEmoji}</p>
                </div>}
            </div>
            <div>
              <p className="font-medium mb-1 text-gray-500 text-base">Creator</p>
              <p className="font-semibold text-white text-2xl">{eventInfo.creator ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-medium mb-1 text-gray-500 text-base">Authorized</p>
              <p className="font-semibold text-white text-2xl">{eventInfo.authorized ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-medium mb-1 text-gray-500 text-base">#Holders</p>
              <p className="font-semibold text-white text-2xl">{eventInfo.holders}</p>
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
        </div>
      )}
    </div >
  );
};

export default CollectionCard;
