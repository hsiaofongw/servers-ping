import { NextApiRequest, NextApiResponse } from 'next';
import targetsData from '../../data/watchList.json';
import got from 'got';
import { saveManyResponses } from '../../helpers/logsDto';
import { v4 as uuidv4 } from 'uuid';

function attachBatchInfo(resp: ISimplifiedResponse, info: IBatchInfo) {
    for (const k in info) {
        resp[k] = info[k];
    }

    return resp;
}

function getSimplifiedResponseTemplate() {
    return {
        'content-type': '',
        'cache-control': '',
        'date': '',
        'etag': '',
        'x-vercel-cache': '',
        'age': '',
        'server': '',
        'transfer-encoding': '',
        'content-encoding': ''
    };
}

async function makeResponse(target: IWatchTarget) {
    const url = target.url;
    const siteName = target.siteName;
    const requestIgnitedAt = new Date().valueOf();
    return got( url, {
        method: 'GET', headers: {
            'User-Agent': 'servers-ping, status monitor'
        }
    }).then(gotResp => {
        const requestArrivedAt = new Date().valueOf();
        const upstreamHeaders = gotResp.headers;
        const body = gotResp.body;
        const statusCode = gotResp.statusCode;
        const statusMessage = gotResp.statusMessage || "";
        const roundTrip = requestArrivedAt - requestIgnitedAt;
        const requestId = uuidv4();

        let headers = getSimplifiedResponseTemplate();
        for (const k in upstreamHeaders) {
            headers[k] = upstreamHeaders[k];
        }

        let response = {
            batchInitiatedAt: 0, 
            batchInitiatedAtISO: '',
            batchId: '', 
            requestId, 
            requestIgnitedAt, 
            requestArrivedAt,
            roundTrip,
            siteName, 
            url, 
            statusCode, 
            statusMessage,
            headers
        } as ISimplifiedResponse;

        return response;
    });
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const t0 = new Date();

    const batchInfo = {
        batchId: uuidv4(),
        batchInitiatedAt: t0.valueOf(), 
        batchInitiatedAtISO: t0.toISOString()
    };

    const targets = targetsData as IWatchTarget[];
    const promises = targets.map(async target => {
        const resp = await makeResponse(target);
        return attachBatchInfo(resp, batchInfo);
    });

    Promise.allSettled(promises)
    .then(settles => {
        const values: ISimplifiedResponse[] = [];
        for (const settle of settles) {
            if (settle.status === 'fulfilled') {
                values.push(settle.value);
            }
        }

        return values;
    })
    .then(async values => {
        await saveManyResponses(values);
    })
    .then(d => {
        res.json({
            ok: true,
            msg: 'No Error(s).',
            batchInfo
        });
    })
    .catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Internal Error.',
            batchInfo
        });
    })
    .finally(() => {
        res.end();
    });
}

export default requestHandler;