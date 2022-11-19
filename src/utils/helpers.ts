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

  try {
    const resJSON = await axios({
      method: "get",
      url: ipfsHttps,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        'Access-Control-Allow-Credentials': true
      },
      responseType: 'json'
    });
    const isError = false;
    return [resJSON, isError];
  } catch (error) {
    console.log("IPFS fetch", error)
  }
  const resJSON = {
    data: {
      name: "test",
      image: "ipfs://QmS9tg7tLQ2W7c7Qxi4U1yhJY3ZZnGqKzjskikCSuZWDv9"
    }
  };
  // return [{}, true];
  return [resJSON, true];
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