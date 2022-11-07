import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

import { Header } from "../components";
import { useIsMounted } from "../hooks";
import { chains, wagmiClient } from "../utils/web3";

function MyApp({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={midnightTheme()}>
        <Head>
          <title>FuturePoap</title>
        </Head>
        <div className="bg-gradient-to-b to-sky-500 from-sky-600 bg-cover min-h-screen">
          <Header />
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
