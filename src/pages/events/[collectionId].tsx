/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, FormEvent, useState } from "react";
import { useAccount, useContractRead, useContractReads, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { futurepoap_abi } from "../../../futurepoap";
import { Result } from "ethers/lib/utils";
import { defaultIcon } from "../../utils/web3";
import { fetchIPFSJSON, getIPFSImage } from "../../utils/helpers";
import { PoapCardEvent } from "../../components";
import { emojiAvatarForEvent } from "../../utils/emoji-avatar";
import { BounceLoader } from 'react-spinners';
import { EventJSONData } from "../../utils/types"

// TODO add contract here
const Collection: NextPage = () => {
  const [eventInfo, setEventInfo] = useState({
    holders: 0,
    authorized: false,
    creator: false,
    minter: false
  });
  const [newPoapAddress, setNewPoapAddress] = useState("");
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalFormLoading, setModalFormLoading] = useState(false);
  const [minterAddress, setMinterAddress] = useState("");
  const [modalMinterFormOpen, setModalMinterFormOpen] = useState(false);
  const [modalMinterFormLoading, setModalMinterFormLoading] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState("");


  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");
  const { isConnected, address } = useAccount();
  const {
    query: { collectionId },
    push,
  } = useRouter();
  const eventId = Number(collectionId);
  const futurepoapConfig = {
    addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
    contractInterface: futurepoap_abi
  };

  const { config: mintWriteConfig } = usePrepareContractWrite({
    ...futurepoapConfig,
    functionName: 'mintToken',
    args: [eventId, newPoapAddress],
  });

  const { data: mintData,
    write: mintPoap,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError
  } = useContractWrite(mintWriteConfig);

  const {
    data: txMintData,
    isSuccess: txMintSuccess,
    error: txMintError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const handleMintOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setModalFormLoading(true);
    event.preventDefault();
    mintPoap?.();
    setModalFormLoading(false);
  }



  const { data: indexEvent, error: readError, isLoading: readLoading } = useContractReads({
    contracts: [
      {
        ...futurepoapConfig,
        functionName: "balanceOfEvent",
        args: [eventId]
      },
      {
        ...futurepoapConfig,
        functionName: "isEventCreator",
        args: [eventId, address]
      },
      {
        ...futurepoapConfig,
        functionName: "authorized",
        args: [eventId]
      },
      {
        ...futurepoapConfig,
        functionName: "isEventMinter",
        args: [eventId, address]
      },
      {
        ...futurepoapConfig,
        functionName: "eventMetaURI",
        args: [eventId]
      }
    ]
  })

  useEffect(() => {
    async function fetchJSON() {
      const [eventJSON, getIPFSError] = (await fetchIPFSJSON(((indexEvent as Result[])[4]).toString())) as [EventJSONData, Boolean];
      if (getIPFSError) {
        setEventName(`[${eventId}]`);
        setEventImage(defaultIcon);
        setAvatarEmoji(emojiAvatarForEvent(eventId).emoji);
        return;
      }
      setEventName(eventJSON.data.name as string);
      setEventImage(getIPFSImage(eventJSON.data.image as string) as string);
    }
    if (!readError && !readLoading && indexEvent && indexEvent.every(e => (e !== null && e !== undefined))) {
      fetchJSON();
      setEventInfo({
        holders: indexEvent[0].toNumber(),
        creator: Boolean(indexEvent[1]),
        authorized: Boolean(indexEvent[2]),
        minter: Boolean(indexEvent[3])
      });
    }
  }, [indexEvent, readError, readLoading, eventId]);

  useEffect(() => {
    if (!isConnected) {
      push("/");
    }
  }, [isConnected, push]);
  useEffect(() => {
    if (txMintSuccess) {
      alert("Create successfully");
      setModalFormOpen(false);
    }
  }, [txMintSuccess])

  if (!isConnected) return null;

  const indexArray = Array.from({ length: eventInfo.holders }, (item, index) => index);
  const mintWaiting = (modalFormLoading || isMintLoading || isMintStarted) && !mintError;
  return (
    <main className="flex flex-col items-center justify-center mt-16 w-full">
      <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
        <p className="font-medium text-4xl text-white">
          <Link href="/" passHref>
            <a className="opacity-70 hover:opacity-100 cursor-pointer">
              Events
            </a>
          </Link>{" "}
          / {eventName}{" "}
        </p>
        <div className="flex space-x-4">
          {eventInfo.minter && <button className="rounded-md button-outlined focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" onClick={() => { setModalFormOpen(true) }} >Pop Poap!</button>}
          {eventInfo.creator && (<button className="rounded-md button-outlined focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800" onClick={() => { setModalMinterFormOpen(true) }} >Edit minters</button>)}
        </div>
      </header>
      <div className="flex items-center justify-center">
        {!avatarEmoji && <img alt={eventName} src={eventImage} className="h-[250px] rounded-full border-2 border-gray-300" />}
        {avatarEmoji && <div className={`flex items-center justify-center h-[250px] w-[250px] rounded-full border-2 border-gray-300 bg-[#ff9a23]`}>
          <p className="text-5xl">{avatarEmoji}</p>
        </div>}
      </div>
      <div className="flex items-center justify-center">
        <p className="font-medium text-lg text-white">
          {eventInfo.creator ? "You're creator;" : "You're not creator;"}
          {" "}
          {eventInfo.minter ? "You're minter;" : "You're not minter;"}
          {" "}
          Total {eventInfo.holders} Poaps
        </p>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-4 mb-20 mt-4">
        {indexArray.map((poapIndex) => {
          return (
            <PoapCardEvent key={poapIndex} eventId={Number(eventId)} poapIndex={poapIndex} />
          )
        })}
      </div>

      {modalFormOpen &&
        <div id="authentication-modal" className="flex items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full">
          <div className="relative w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" onClick={() => { setModalFormOpen(false) }} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create a FuturePoap</h3>
                <form className="space-y-6" action="#" onSubmit={handleMintOnSubmit}>
                  <div>
                    <label htmlFor="poapaddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Minting to</label>
                    <input type="poapaddress" onChange={(event) => {
                      setNewPoapAddress(event.target.value);
                    }} name="poapaddress" id="poapaddress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="0x..." required />
                  </div>
                  <div className="flex items-center justify-center">
                    {mintWaiting && <div className="flex space-x-1">
                      <BounceLoader
                        color={'#2C4565'}
                        loading={true}
                        size={40}
                      />
                      <p className="text-l text-gray-500 dark:text-gray-400 mt-2">
                        {isMintLoading && 'Waiting for approval'}
                        {isMintStarted && 'Minting...'}
                        {!isMintLoading && !isMintStarted && 'Pull up contract'}
                      </p>
                    </div>}
                    {!mintWaiting && <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      {mintError && ("Error, re-submit")}
                      {!mintError && ("Mint a FuturePoap")}
                    </button>
                    }
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>}

      {modalMinterFormOpen &&
        <div id="authentication-modal" tabIndex={-1} className="flex items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full">
          <div className="relative w-full max-w-md h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" onClick={() => { setModalMinterFormOpen(false) }} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit minters</h3>
                <form className="space-y-6" action="#">
                  <div>
                    <label htmlFor="poapaddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Change the role of</label>
                    <input type="poapaddress" onChange={(event) => {
                      setMinterAddress(event.target.value);
                    }} name="poapaddress" id="poapaddress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="0x..." required />
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Remove this minter</button>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add this minter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>}

    </main>
  );
};

export default Collection;
