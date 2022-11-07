export interface NFT {
  id: number;
  name: string;
  description?: string;
  awsUrl: string;
}

export interface NFTCardProps {
  nft: NFT;
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
