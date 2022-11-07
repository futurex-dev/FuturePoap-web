/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useIsMounted } from "../hooks";

export const Header = () => {
  const isMounted = useIsMounted();

  return (
    <header className="flex items-center justify-between px-16 pt-7">
      <a href="https://futurex.dev/" className="font-bold text-center text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-slate-700"> FutureX </a>
      {isMounted && (
        <ConnectButton label="Sign in" />
      )}

    </header>
  );
};

export default Header;
