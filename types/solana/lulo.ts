export interface LuloAccountDetailsResponse {
    totalValue: number;
    interestEarned: number;
    realtimeApy: number;
    settings: {
        owner: string;
        allowedProtocols: string | null;
        homebase: string | null;
        minimumRate: string;
    };
} 