/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { futurepoap_abi } from "../../../futurepoap";
import EventForm from "../../components/event-form"

const Collection: NextPage = () => {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const { chain } = useNetwork();

    useEffect(() => {
        if (!isConnected) {
            router.push("/");
        }
    }, [isConnected, router]);

    if (!isConnected) return null;

    return (
        <main className="flex flex-col items-center justify-center mt-16 w-full">
            <header className="flex items-center justify-between mb-12 px-16 pt-7 w-full">
                <p className="font-medium text-4xl text-white w-half">
                    <Link href="/" passHref>
                        <a className="opacity-70 hover:opacity-100 cursor-pointer">
                            Events
                        </a>
                    </Link>{" "}
                    / New Event{" "}
                </p>
                <div className="flex space-x-4">
                    {(chain?.name === "Ganache") && (
                        <p className="font-medium text-lg text-white ml-16 mr-auto">
                            Ganache test
                        </p>)}
                    {(chain?.name === "Goerli") && (
                        <p className="font-medium text-lg text-white ml-16 mr-auto">
                            {/* View FuturePoap on
                    <a className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-500 opacity-80 hover:opacity-100 cursor-pointer"
                        href={`https://goerli.etherscan.io/address/${process.env.NEXT_PUBLIC_goerli_contract_ADDRESS}`}>
                        {" "}Etherscan
                    </a> */}
                            Not deploy contract yet
                        </p>)}
                </div>
            </header>

            <EventForm></EventForm>
        </main>
    );
};

export default Collection;
