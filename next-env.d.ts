/// <reference types="next" />
/// <reference types="next/types/global" />

interface ISimplifiedResponse {
    siteName: string;
    url: string;
    statusCode: number;
    headers: ISimplifiedHeaders
}

interface ITriggerLog {
    datetime: string;
    invokedAPI: string;
    headers: ISimplifiedHeaders;
    responses: ISimplifiedResponse[];
}

interface ISimplifiedHeaders {
    [key: string]: string;
}
