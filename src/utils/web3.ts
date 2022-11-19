import { getDefaultWallets, Chain } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const ENV = process.env.NODE_ENV;
var setChains: any[];
var setProviders: any[];
if (ENV === 'development') {
  console.log("It is on development mode")
  const ganacheChain: Chain = {
    id: 31337,
    name: 'Ganache',
    network: 'Ganache',
    iconUrl: 'https://trufflesuite.com/img/ganache-feature-1-icon.svg',
    iconBackground: '#fff',
    nativeCurrency: {
      decimals: 10,
      name: 'Go',
      symbol: 'Go',
    },
    rpcUrls: {
      default: 'http://127.0.0.1:8545',
    },
    testnet: true,
  };
  setChains = [
    chain.goerli,
    ganacheChain
  ];
  setProviders = [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_goerli_APIKEY,
    }),
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
  ];
} else {
  setChains = [
    chain.goerli,
  ];
  setProviders = [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_goerli_APIKEY,
    }),
  ];
}



export const { chains, provider, webSocketProvider } = configureChains(
  setChains,
  setProviders
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const defaultIcon = "https://avatars.githubusercontent.com/u/6250754?s=200&v=4";