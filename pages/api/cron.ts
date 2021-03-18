import { NextApiRequest, NextApiResponse } from 'next';
import targetsData from '../../data/watchList.json';
import got from 'got';
import { saveManyResponses } from '../../helpers/dto';
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
    const requestId = uuidv4();

    let template = {
        batchInitiatedAt: 0,
        batchInitiatedAtISO: '', 
        batchId: '', 
        requestId: '',
        requestIgnitedAt: 0,
        requestArrivedAt: 0,
        roundTrip: 0,
        siteName: '',
        url: '',
        statusCode: 0,
        statusMessage: '',
        headers: {},
        errorCode: '',
        errorMessage: ''
    }

    template.siteName = siteName;
    template.url = url;
    template.requestId = requestId;
    template.requestIgnitedAt = requestIgnitedAt;

    return got( url, {
        method: 'GET', headers: {
            'User-Agent': 'servers-ping, status monitor',
            'Pragma': 'no-cache'
        }
    }).then(gotResp => {
        const requestArrivedAt = new Date().valueOf();
        const upstreamHeaders = gotResp.headers;
        const body = gotResp.body;
        const statusCode = gotResp.statusCode;
        const statusMessage = gotResp.statusMessage || "";
        const roundTrip = requestArrivedAt - requestIgnitedAt;
        
        let headers = getSimplifiedResponseTemplate();
        for (const k in upstreamHeaders) {
            headers[k] = upstreamHeaders[k];
        }

        template.requestArrivedAt = requestArrivedAt;
        template.roundTrip = roundTrip;
        template.statusCode = statusCode;
        template.statusMessage = statusMessage;
        template.headers = headers;

        return template;
    }).catch(error => {
        console.log(error);

        template.errorCode = error?.code || "";
        template.errorMessage = error?.message || error?.msg || "";
        return template;
    });
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const ip = (req.headers['x-real-ip'] as string) || '';
    if (ip !== process.env?.ALLOWED_IP) {
        res.status(403).json({
            ok: false,
            msg: 'Forbidden'
        });
        return;
    }

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

