'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { FC, ReactNode } from 'react';
import GlobalConnectWalletProvider from './_components/connect-wallet/config';

interface ProvidersProps {
    children: ReactNode;
}

const GlobalProvider: FC<ProvidersProps> = ({ children }) => {
    // init state
    // const store = useStore(undefined);
    return (
        // <ReduxProvider store={store}>
        //     <NextIntlClientProvider
        //         locale={locale}
        //         messages={messages}
        //     >
        //         <ConfigProvider theme={theme}>
        //             <AntdRegistry>
                        <GlobalConnectWalletProvider>
                            {/* <div>demo12</div> */}
                            {children}
                        </GlobalConnectWalletProvider>
        //             </AntdRegistry>
        //         </ConfigProvider>
        //     </NextIntlClientProvider>
        // </ReduxProvider>
    );
};

export default GlobalProvider;
