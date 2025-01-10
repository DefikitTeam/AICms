import useSWR from "swr";

export const useStakeData = ({ 
    inputAmount, 
    slippageBps,
    userPublicKey,
}: { 
    inputAmount: number, 
    slippageBps: number,
    userPublicKey: string,
}) => {

    const { data, isLoading, error } = useSWR(`/api/build-transaction/stake`, (url: string) => fetch(url, {
        method: "POST",
        body: JSON.stringify({
            inputAmount,
            slippageBps,
            userPublicKey,
        }),
    }).then(res => res.json()));

    return { data, isLoading, error };
}