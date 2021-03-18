/// <reference types="next" />
/// <reference types="next/types/global" />

interface ISimplifiedResponse {
    batchInitiatedAt: number;
    batchInitiatedAtISO: string;
    batchId: string;
    requestId: string;
    siteName: string;
    url: string;
    statusCode: number;
    statusMessage: string;
    headers: ISimplifiedHeaders;
    requestIgnitedAt: number;
    requestArrivedAt: number;
    roundTrip: number;
    errorCode?: string;
    errorMessage?: string;
}

interface IndexedISimplifiedResponses {
    [key: string]: ISimplifiedResponse[];
}

interface ISimplifiedHeaders {
    [key: string]: string;
}

interface IWatchTarget {
    siteName: string;
    url: string;
}

interface IBatchInfo {
    batchId: string;
    batchInitiatedAt: number;
    batchInitiatedAtISO: string;
}

interface IHomeProps {
    targets: IWatchTarget[];
    responses: ISimplifiedResponse[];
}

interface ISlots48Props {
    responses: ISimplifiedResponse[];
}

interface IRectProps {
    width?: number;
    height?: number;
    color?: string;
}