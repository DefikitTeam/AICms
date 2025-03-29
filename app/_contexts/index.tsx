"use client";

import { Theme } from "@radix-ui/themes";
import { ColorModeProvider } from "./color-mode";
import { PrivyProvider } from "./privy";

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <PrivyProvider>
      <Theme>
          <ColorModeProvider>{children}</ColorModeProvider>
      </Theme>
    </PrivyProvider>
  );
};

export default Providers;

export * from "./color-mode";
