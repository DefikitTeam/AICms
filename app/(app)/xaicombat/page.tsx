'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Text, Spinner } from '@radix-ui/themes';
import {Navbar,Dashboard} from "x-ai-combat/frontend"

const XAICombatContent = () => {
    const searchParams = useSearchParams();
    const agentId = searchParams.get('agentId');

    return (
        <div>
            <Navbar agentId={agentId as string} />
            <Dashboard agentId={agentId as string} />
        </div>
    );
};



export default XAICombatContent; 