import { Connection, VersionedTransaction, AddressLookupTableAccount, TransactionMessage } from "@solana/web3.js";

import { useSolanaWallets } from "@privy-io/react-auth/solana";

export const useSendTransaction = () => {

    const { wallets } = useSolanaWallets();

    const sendTransaction = async (transaction: VersionedTransaction) => {
        if(!wallets.length) throw new Error("No wallets found");

        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);

        // Resolve address lookup tables if present
        if (transaction.message.addressTableLookups.length > 0) {
            const lookupTableAccounts = await Promise.all(
                transaction.message.addressTableLookups.map(async (lookup) => {
                    return connection.getAddressLookupTable(lookup.accountKey).then((res) => res.value);
                })
            );
            
            if (lookupTableAccounts.some((account) => account === null)) {
                throw new Error("Failed to fetch some address lookup tables");
            }

            // Filter out any null accounts
            const validAccounts = lookupTableAccounts.filter((account): account is AddressLookupTableAccount => account !== null);
            
            // Decompile and recompile the message to resolve lookup tables
            const newMessage = TransactionMessage.decompile(transaction.message, {
                addressLookupTableAccounts: validAccounts
            });
            
            // Update the transaction's message in place
            transaction.message = newMessage.compileToV0Message();
        }

        return wallets[0].sendTransaction(transaction, connection, {
            skipPreflight: true,
        });
    }

    return {
        sendTransaction
    }
}