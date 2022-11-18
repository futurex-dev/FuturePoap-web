/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";

import { PoapCardEventProps } from "../utils/types";
import { futurepoap_abi } from "../../futurepoap";
import { useContractRead, useAccount } from "wagmi";
import { Result } from "ethers/lib/utils";

const PoapCard = ({ eventId, poapIndex }: PoapCardEventProps) => {
    const [isMinted, setIsMinted] = useState(false);

    const handleMintButtonClick = () => {
        setIsMinted(true);
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
    console.log(poapIndex);
    return (
        <div className="border-solid border-2 border-black-opaque bg-black-opaque w-[160px] rounded-md pb-6">
            {showToken &&
                <div>
                    {/* <img alt={name} src={awsUrl} /> */}
                    <div className="flex flex-col gap-4 mt-4 px-4">
                        <div>
                            <p className="font-medium mb-1 text-gray-500 text-base">Address</p>
                            <p className="font-semibold text-white text-2xl">{(userAddress as Result).toNumber()}</p>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-red-700 rounded"
                            onClick={handleMintButtonClick}
                        >
                            Burn
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default PoapCard;
