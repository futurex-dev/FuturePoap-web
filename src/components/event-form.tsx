/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
    useAccount,
    useNetwork,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from 'wagmi';
import { futurepoap_abi } from "../../futurepoap";
import { BounceLoader } from 'react-spinners';
import axios from "axios";
import { config } from "dotenv";

// TODO read event ID from event
const EventForm = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [eventName, setEventName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    // const [eventId, setEventId] = useState(0);
    const [tokenURI, setTokenURI] = useState<string>("");
    const [hasUpload, setHasUpload] = useState<boolean>(false);
    const [hasMint, setHasMint] = useState<boolean>(false);
    const [hasSuccess, setHasSuccess] = useState<boolean>(false);

    const router = useRouter();
    const { chain } = useNetwork();
    const { address } = useAccount();


    const { config: contractWriteConfig } = usePrepareContractWrite({
        addressOrName: process.env.NEXT_PUBLIC_contract_ADDRESS || "",
        contractInterface: futurepoap_abi,
        functionName: 'createEvent',
        args: [tokenURI],
    });

    const { data: mintData,
        write: createEventOnchain,
        isLoading: isMintLoading,
        isSuccess: isMintStarted,
        error: mintError
    } = useContractWrite(contractWriteConfig);

    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransaction({
        hash: mintData?.hash,
    });

    useEffect(() => {
        if (tokenURI && !hasMint && createEventOnchain) {
            setHasMint(true);
            createEventOnchain?.();
        }
    }, [tokenURI, hasMint, createEventOnchain]);
    useEffect(() => {
        // reset everything when error, only when 
        if (mintError || txError) {
            console.log("Trigger reset");
            setHasMint(false);
            setTokenURI("");
        }
    }, [mintError, txError]);
    useEffect(() => {
        if (txSuccess) {
            alert("Create successfully");
            router.push("/");
        }
    }, [txSuccess, router]);

    const showWaiting = (loading || isMintLoading || isMintStarted) && !mintError;

    const sendJSONtoIPFS = async (ImgHash: string) => {
        try {

            const resJSON = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                data: {
                    "name": eventName,
                    "image": ImgHash
                },
                headers: {
                    'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
                },
            });

            const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
            return tokenURI;

        } catch (error) {
            console.log("JSON to IPFS: ")
            console.log(error);
        }
        return "";
    }
    const sendFileToIPFS = async () => {

        if (selectedImage) {
            try {

                const formData = new FormData();
                formData.append("file", selectedImage);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                        'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                //Take a look at your Pinata Pinned section, you will see a new file added to you list.
                const tokenURI = await sendJSONtoIPFS(ImgHash);
                return tokenURI;

            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
        return "";
    }

    const fakeOne = async () => {
        return "ipfs://QmUkJRZBP4RN1QAv3LephaKvVUqhEDKk7ZSK69BkuaShLP";
    }

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        var tokenURIIpfs: string = tokenURI;
        if (!hasUpload) {
            tokenURIIpfs = (await sendFileToIPFS());
            // tokenURIIpfs = "ipfs://QmUkJRZBP4RN1QAv3LephaKvVUqhEDKk7ZSK69BkuaShLP";

        }
        if ((tokenURIIpfs !== "") && !hasUpload) {
            setHasUpload(true);
        }
        setTokenURI(tokenURIIpfs);
        setLoading(false);
    }

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <div className="flex flex-col bg-black-opaque mb-10 rounded-md p-10 w-[60vw] max-w-[800px] min-w-[500px]">
            <form onSubmit={handleOnSubmit}>
                <div className="flex items-center justify-center">
                    {selectedImage && (
                        <div className="flex items-center justify-center w-full">
                            <img className="rounded-full border-2 border-gray-300" alt="not fount" width={"150px"} src={URL.createObjectURL(selectedImage)} />
                            {/* <button className="" onClick={(event) => {
                                setSelectedImage(null);
                            }}></button> */}
                        </div>
                    )}
                    {!selectedImage && (<div>
                        <div className="flex justify-center items-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full w-64 
                            bg-gray-50 rounded-lg border-2 border-gray-200 border-dashed cursor-pointer dark:hover:bg-gray-800 
                            dark:bg-red-900/50 hover:bg-gray-100 dark:border-red-900/75 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={(event) => {
                                    event.stopPropagation();    // stop react bubbling up click event
                                    event.preventDefault();     // stop react refreshing the browser
                                    if (!event.target.files) return;
                                    setSelectedImage(event.target.files[0]);
                                }} required />
                            </label>
                        </div>
                        <br />
                    </div>
                    )}
                </div>
                <br />
                <div className="relative z-0 mb-6 w-full group">
                    <input defaultValue="" disabled={hasUpload} onChange={(event) => {
                        setEventName(event.target.value);
                    }} className="block py-2.5 px-0 w-full text-2l text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-2l text-gray-700 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Event Name</label>
                </div>

                <div className="flex items-center justify-center">
                    {showWaiting && <div className="flex space-x-1">
                        <BounceLoader
                            color={'#2C4565'}
                            loading={true}
                            size={40}
                        />
                        <p className="text-l text-gray-500 dark:text-gray-400 mt-2">
                            {isMintLoading && 'Waiting for approval'}
                            {isMintStarted && 'Minting...'}
                            {!isMintLoading && !isMintStarted && 'Upload to IPFS'}
                        </p>
                    </div>}
                    {!showWaiting && <button type="submit" className="justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {mintError && ("Error, re-submit")}
                        {!mintError && ("Submit")}
                    </button>
                    }
                </div>
            </form>
        </div>
    );
}

export default EventForm;
