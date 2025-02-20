'use client';

import React, { useState, useEffect } from 'react';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Export a function to get token instead of the token directly
export const getAuthToken = async () => {
  const { getAccessToken } = usePrivy();
  return await getAccessToken();
};

const LoginButton: React.FC = () => {
  const router = useRouter();
  const { authenticated, getAccessToken } = usePrivy();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      getAccessToken().then(setToken);
    }
  }, [authenticated, getAccessToken]);

  const { login } = useLogin({
    onComplete: (_, __, wasAlreadyAuthenticated) => {
      if (!wasAlreadyAuthenticated) {
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