export interface NFT {
  id: number;
  eventId: number;
  name: string;
  description?: string;
  awsUrl: string;
}

export interface PoapCardProps {
  userAccount: string;
  poapIndex: number;
}

export interface PoapCardEventProps {
  eventId: number;
  poapIndex: number;
}

export interface Collection {
  id: number;
  name: string;
  nfts: NFT[];
  creator: string;
  authorized: boolean;
}

export interface CollectionCardProps {
  collection: Collection;
}

export interface EventJSONData {
  data: {
    name: string;
    image: string;
  };
}