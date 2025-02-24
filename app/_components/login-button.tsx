'use client';

import { Button } from '@/components/ui';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LoginButton: React.FC = () => {
  const router = useRouter();
  const { authenticated, getAccessToken } = usePrivy();
  const [, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      getAccessToken().then(setToken);
    }
  }, [authenticated, getAccessToken]);

  const { login } = useLogin({
    onComplete: (params) => {
      if (!params.wasAlreadyAuthenticated) {
        router.replace('/manageAI');
      }
    },
  });

  if (authenticated)
    return (
      <Link href="/manageAI">
        <Button variant={'brand'}>Get Started</Button>
      </Link>
    );

  return (
    <Button
      variant={'brand'}
      onClick={() => login()}
      disabled={authenticated}
    >
      Login
    </Button>
  );
};

export default LoginButton;
