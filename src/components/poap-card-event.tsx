/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { PoapCardEventProps } from "../utils/types";
import { futurepoap_abi } from "../../futurepoap";
import { emojiAvatarForAddress } from "../utils/emoji-avatar"
import { useContractRead, useAccount } from "wagmi";
import { Result } from "ethers/lib/utils";

const PoapCardEvent = ({ eventId, poapIndex }: PoapCardEventProps) => {
    const [userAvatar, setUserAvatar] = useState({
        color: "",
        emoji: ""
    });
    const handleBurnButtonClick = () => {
        alert("Burn is not already yet");
    };

    const callingObject = {
        addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
        contractInterface: futurepoap_abi,
        functionName: "userOfEventByIndex",
        args: [Number(eventId), poapIndex]
    }

    const { data: userAddress, error: readError, isLoading: readLoading } = useContractRead({
        ...callingObject,
    })

    const showToken = !readLoading && !readError;

    useEffect(() => {
        if (!readLoading && !readError && userAddress) {
            setUserAvatar(emojiAvatarForAddress(userAddress.toString()));
        }
    }, [userAddress, readError, readLoading])
    return (
        <div className="border-solid border-2 border-black-opaque bg-black-opaque w-[200px] rounded-md pb-6">
            {showToken &&
                <div>
                    {/* <img alt={name} src={awsUrl} /> */}
                    <div className="flex items-center justify-center mt-5">
                        <div className={`flex items-center justify-center h-[150px] w-[150px] rounded-full border-2 border-gray-300 bg-[#ff6780]`}>
                            <p className="text-8xl">{userAvatar.emoji}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-4 px-4 ">
                        <div>
                            <p className="font-medium mb-1 text-gray-500 text-base">Address</p>
                            <p className="font-light text-gray-600 text-sm break-words">{(userAddress as Result).toString()}</p>
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
        </div>
    );
};

export default PoapCardEvent;
