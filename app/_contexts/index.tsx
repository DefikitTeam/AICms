"use client";

import { PrivyProvider } from "./privy";
import { ColorModeProvider } from "./color-mode";

interface Props {
    children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
    return (
        <PrivyProvider>
            <ColorModeProvider>
                {children}
            </ColorModeProvider>
        </PrivyProvider>
    )
}

export default Providers;

export * from "./color-mode"