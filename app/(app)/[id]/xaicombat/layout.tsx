'use client';

import { AuthProvider as XaiCombatAuthProvider } from "@defikitdotnet/x-ai-combat/contexts";
import React from 'react';

export default function XaicombatLayout({ children }: { children: React.ReactNode }) {
    return <XaiCombatAuthProvider>{children}</XaiCombatAuthProvider>;
} 