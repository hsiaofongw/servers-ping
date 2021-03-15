/// <reference types="next" />
/// <reference types="next/types/global" />

interface ISimplifiedResponse {
    siteName: string;
    url: string;
    statusCode: number;
    headers: ISimplifiedHeaders;
    timeStart: number;
    timeReceive: number;
    roundtrip: number;
}

interface ITriggerLog {
    datetime: string;
    since: number;
    responses: ISimplifiedResponse[];
}

interface ISimplifiedHeaders {
    [key: string]: string;
}

interface IWatchTarget {
    siteName: string;
    url: string;
}
