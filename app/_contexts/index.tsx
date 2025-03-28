"use client";

import { SidebarProvider } from "@/components/ui";
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
        <SidebarProvider>
          <ColorModeProvider>{children}</ColorModeProvider>
        </SidebarProvider>
      </Theme>
    </PrivyProvider>
  );
};

export default Providers;

export * from "./color-mode";
