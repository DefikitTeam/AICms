/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/*eslint-disable-next-line @typescript-eslint/no-unused-vars*/

import { Button } from "@/components/ui";
import {  useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { ILoginRequest } from "@/lib/embed/types";


const LoginButton: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // const { address } = useAccount();
  // const [, setToken] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const {
    signMessage,
    isSuccess,
    error,
    data,
    isPending,
    reset,
    variables,
    isError,
    isIdle,
    signMessageAsync,
    context,
  } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Helper function to check if token is valid
  const isTokenValid = useCallback(() => {
    const token = localStorage.getItem('jwt_access_token');
    const expirationTime = localStorage.getItem('jwt_expiration_time');
    
    if (!token) return false;
    
    // If we have expiration time, check if token is still valid
    if (expirationTime) {
      return parseInt(expirationTime) > Date.now();
    }
    
    // No expiration time but token exists (backwards compatibility)
    return true;
  }, []);

  // Check for JWT token on component mount
  useEffect(() => {
    // First determine if we have a valid token
    if (isTokenValid()) {
      setIsAuthenticated(true);
      
      // If we're authenticated and wallet is connected, ensure we set the connection flag
      if (isConnected && address) {
        sessionStorage.setItem('wallet_was_connected', 'true');
      }
    } else {
      // Clean up invalid tokens
      if (localStorage.getItem('jwt_access_token')) {
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_expiration_time');
      }
      setIsAuthenticated(false);
    }
  }, [isTokenValid, isConnected, address]);

  useEffect(() => {
    if (!isConnected) {
      reset();
      // setShow(false);
    }
  }, [isConnected, reset]);

  const handleLogin = useCallback(async () => {
    // First check if we already have a valid token
    if (isTokenValid()) {
      setIsAuthenticated(true);
      return; // Skip login if we're already authenticated
    }
    
    if (!address || !isConnected) {
      // If not connected, open the connect modal
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }
    
    // If already connected with wallet but not authenticated,
    // trigger the signing process
    if (!isAuthenticated && !isSigningIn) {
      // Start the sign message process
      const message = `Sign this message to authenticate with our application: ${address}`;
      console.log("Message to sign:", message);
  
      try {
        setIsSigningIn(true);
        const signature = await signMessageAsync({
          message
        });

        console.log("✅ Signature received:", signature);
  
        const loginWalletData: ILoginRequest = {
          wallet: {
            address: address as `0x${string}`,
            message: message,
            signature: signature,
          },
        };
  
        console.log("loginWalletData------", loginWalletData)
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, loginWalletData);
          console.log("Login response:", response.data);
          
          // Store JWT token in localStorage if login successful
          if (response.data && response.data.success) {
            localStorage.setItem('jwt_access_token', response.data.auth.accessToken);
              
            // Store token expiration time
            if (response.data.auth.expiresIn) {
              const expiresIn = response.data.auth.expiresIn; // Thời gian hết hạn (giây)
              const expirationTime = Date.now() + (expiresIn * 1000); // Chuyển đổi sang milliseconds
              localStorage.setItem('jwt_expiration_time', expirationTime.toString());
              console.log("JWT expiration time:", new Date(expirationTime).toLocaleString());
            }
            
            console.log("JWT token saved to localStorage:", response.data.auth.accessToken);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Login API error:', error);
          disconnect();
        }
      } catch (error) {
        console.error('User rejected the signature:', error);
        disconnect();
      } finally {
        setIsSigningIn(false);
      }
    }
  }, [address, isConnected, isAuthenticated, isSigningIn, openConnectModal, signMessageAsync, setIsSigningIn, setIsAuthenticated, disconnect, isTokenValid]);

  // Add a new useEffect to trigger sign message when wallet is connected
  useEffect(() => {
    // Create a flag to track if this is an initial connection
    const isInitialConnection = sessionStorage.getItem('wallet_was_connected') !== 'true';
    
    // Check if wallet is connected but user is not yet authenticated
    if (isConnected && address && !isAuthenticated && !isSigningIn) {
      // Only auto-trigger sign message if this appears to be a fresh connection
      // (not just returning to the page after navigation)
      if (isInitialConnection) {
        // Set the flag to indicate wallet has been connected
        sessionStorage.setItem('wallet_was_connected', 'true');
        handleLogin();
      }
    }
    
    // If wallet disconnects, reset the flag
    if (!isConnected) {
      sessionStorage.removeItem('wallet_was_connected');
    }
    
  }, [isConnected, address, isAuthenticated, isSigningIn, handleLogin]);

  if ((address && isAuthenticated) || (address && isSigningIn))
    return (
      <Link href="/manageAI">
        <Button variant={"brand"}>Get Started</Button>
      </Link>
    );

  return (
    <Button variant={"brand"} onClick={handleLogin} disabled={isSigningIn}>
      {isSigningIn ? "Đang xử lý..." : "Login"}
    </Button>
  );
};

export default LoginButton;

