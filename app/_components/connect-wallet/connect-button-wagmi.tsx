/* eslint-disable */

import { ILoginRequest } from "@/lib/embed/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount,  useDisconnect, useSignMessage } from "wagmi";

const ConnectButtonWagmi = () => {
    const { address, isConnected, isConnecting } = useAccount();
    // const { isMobile } = useWindowSize();
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
        context
    } = useSignMessage();

    

    // const { authState, loginAction } = useAuthLogin();
    const { disconnect } = useDisconnect();

    const [show, setShow] = useState<boolean>(false);
    const [hasAttemptedSignature, setHasAttemptedSignature] = useState(false);
    const handleClickConnectButton = () => {
        setShow(true);
    };

    // useEffect(() => {
      

    //     const handleSignMessage = async () => {
    //         if (!authState.userWallet) {
    //             const message = address as `0x${string}`;
                

    //             try {
    //                 setHasAttemptedSignature(true);
    //                 const signature = await signMessageAsync({
    //                     message: message
    //                 });

    //                 // const refIdFromStorage = await servicePool.getReferId();
    //                 const loginWalletData: ILoginRequest = {
    //                     wallet: {
    //                         // chainId: chainConfig?.chainId!,
    //                         address: address as `0x${string}`,
    //                         message: message,
    //                         signature: signature,

    //                         // refId: refIdFromStorage
    //                         //     ? refIdFromStorage.refId
    //                         //     : ''
    //                     },
    //                     // referralCode: refCode ? refCode : ''
    //                 };


    //                 loginAction(loginWalletData);


    //             } catch (error) {
    //                 console.error('User rejected the signature:', error);
    //                 disconnect();
    //                 // prevAddress.current = null;
    //             }
    //         }
    //     };

       
    //     handleSignMessage();
    //     if (error) {
    //         console.error('Error signing message:', error);
    //     }
    // }, [address]);

    // useEffect(() => {
    //     if (!isConnected) {
    //         reset();
    //         // setShow(false);
    //     }
    // }, [isConnected, reset]);


    // const showChainSelector =
    //     CHAIN_CONFIG[environment].supportedChains.length > 1;

    return (
        <div className="flex flex-row items-center gap-[3px]">
            {/* <Spin
                spinning={isPending || isConnecting}
                delay={0}
            >
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        mounted
                    }) => {
                        const ready = mounted;
                        const connected = ready && account && chain;

                        // if (!ready) {
                        //     return <LoadingPlaceholder />;
                        // }

                        return (
                            <div
                                className="flex items-center gap-4"
                                {...(!ready && {
                                    'aria-hidden': true,
                                    style: {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none'
                                    }
                                })}
                                // onClick={handleClickConnectButton}
                            >
                                {!connected ? (
                                    <DisconnectedState
                                        showChainSelector={showChainSelector}
                                        openConnectModal={openConnectModal}
                                        isMobile={isMobile}
                                    />
                                ) : chain?.unsupported ? (
                                    <UnsupportedChainState
                                        openChainModal={openChainModal}
                                    />
                                ) : (
                                    <ConnectedState
                                        chain={chain}
                                        account={account}
                                        openChainModal={openChainModal}
                                        openAccountModal={openAccountModal}
                                        showChainSelector={showChainSelector}
                                        isMobile={isMobile}
                                    />
                                )}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </Spin> */}
            {/* {authState.userInfo && <NotificationButton />} */}
            <ConnectButton/>
        </div>
    );
};

export default ConnectButtonWagmi;
