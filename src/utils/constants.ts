export const BAYC_NFTS = [
  {
    id: 7393,
    name: "#7393",
    awsUrl:
      "https://img.seadn.io/files/dbb5f1a2a74a639c267811870e5870d3.png?fit=max&w=600",
    eventId: 1
  },
  {
    id: 5119,
    name: "#5119",
    awsUrl:
      "https://img.seadn.io/files/9fb622b237e5f80509f4e9ecde6860a9.png?fit=max&w=600",
    eventId: 1
  },
];

export const CRYPTOPUNKS_NFTS = [
  {
    id: 117,
    name: "CryptoPunk #117",
    awsUrl:
      "https://img.seadn.io/files/d9310f903595ecf171888188d3659c66.png?fit=max&w=600",
    eventId: 2
  },
  {
    id: 1123,
    name: "CryptoPunk #1123",
    awsUrl:
      "https://img.seadn.io/files/d491cc3d11d3db2f01d9314392c7f3a4.png?fit=max&w=600",
    eventId: 2
  },
  {
    id: 4492,
    name: "CryptoPunk #4492",
    awsUrl:
      "https://img.seadn.io/files/218249ce9276ea14b74da59e57c3875e.png?fit=max&w=600",
    eventId: 2
  },
];

export const DOODLE_NFTS = [
  {
    id: 6914,
    name: "Doodle #6914",
    awsUrl:
      "https://img.seadn.io/files/32d60c14ee6393483c6cc326c48f6b63.png?fit=max&w=600",
    eventId: 3
  },
  {
    id: 7675,
    name: "Doodle #7675",
    awsUrl:
      "https://img.seadn.io/files/491a381ccbb6ea8306d8d4b014555d54.png?fit=max&w=600",
    eventId: 3
  },
];

export const COLLECTIONS = [
  {
    id: 1,
    name: "Ethereum Conference",
    nfts: BAYC_NFTS,
    creator: "0x462645095e0e9a3AA68d3a360185495C722aee14",
    authorized: true,
  },
  {
    id: 2,
    name: "Devcon 2022",
    nfts: CRYPTOPUNKS_NFTS,
    creator: "0x462645095e0e9a3AA68d3a360185495C722aee14",
    authorized: false,
  },
  {
    id: 3,
    name: "FutureXCon 2024",
    nfts: DOODLE_NFTS,
    creator: "0x462645095e0e9a3AA68d3a360185495C722aee14",
    authorized: true,
  },
];
