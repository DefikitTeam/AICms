'use client';

import { useParams } from 'next/navigation';
import { Navbar, Dashboard } from "@defikitdotnet/x-ai-combat/frontend";

const XAICombatContent = () => {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div>
            <Navbar agentId={id} />
            <Dashboard agentId={id} />
        </div>
    );
};

export default XAICombatContent;
