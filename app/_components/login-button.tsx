'use client';

import { Button } from '@/components/ui';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const LoginButton: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [, setToken] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (address) {
      console.log('User address:', address);
    }
  }, [address]);

  const login = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  if (address)
    return (
      <Link href="/manageAI">
        <Button variant={'brand'}>Get Started</Button>
      </Link>
    );

  return (
    <Button
      variant={'brand'}
      onClick={() => login()}
    >
      Login
    </Button>
  );
};

export default LoginButton;
