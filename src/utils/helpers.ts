import axios from "axios";

export const getRandomNumber = (min = 0, max = 2) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


export const fetchIPFSJSON = async (ipfsURI: string) => {
  const pinataGate = "https://gateway.pinata.cloud/ipfs/";
  if (!ipfsURI.startsWith("ipfs://")) {
    return {};
  }
  const ipfsHash = ipfsURI.substring("ipfs://".length);
  const ipfsHttps = pinataGate + ipfsHash;

  const resJSON = await axios({
    method: "get",
    url: ipfsHttps,
    // headers: {
    //     'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
    //     'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
    // },
  });
  return resJSON;
};

export const getIPFSImage = (ipfsURI: string) => {
  const pinataGate = "https://gateway.pinata.cloud/ipfs/";
  if (!ipfsURI.startsWith("ipfs://")) {
    return {};
  }
  const ipfsHash = ipfsURI.substring("ipfs://".length);
  const ipfsHttps = pinataGate + ipfsHash;

  return ipfsHttps;
};