// app/xaicombat/layout.tsx
"use client";

import { AuthProvider as XaiCombatAuthProvider } from "x-ai-combat/contexts";

export default function XaicombatLayout({ children }: { children: React.ReactNode }) {
    return <XaiCombatAuthProvider>{children}</XaiCombatAuthProvider>;
}
