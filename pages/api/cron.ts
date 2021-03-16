import { NextApiRequest, NextApiResponse } from 'next';
import targets from '../../data/watchList.json';
import got from 'got';
import { saveResponse } from '../../helpers/logsDto';
import { v4 as uuidv4 } from 'uuid';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const t0 = new Date();
    const batchInitiatedAt = t0.valueOf();
    const batchInitiatedAtISO = t0.toISOString();
    const batchId = uuidv4();
    const promises = [];

    for (const target of targets) {
        const url = target.url;
        const requestIgnitedAt = new Date().valueOf();
        const promise = got( url, {
            method: 'GET', headers: {
                'User-Agent': 'servers-ping, status monitor'
            }
        }).then(gotResp => {
            const requestArrivedAt = new Date().valueOf();
            const headers = gotResp.headers;
            const body = gotResp.body;
            const statusCode = gotResp.statusCode;
            const statusMessage = gotResp.statusMessage || "";
            const roundTrip = requestArrivedAt - requestIgnitedAt;
            const requestId = uuidv4();

            let interestedHeaders = {
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

            for (const k in headers) {
                if (k in interestedHeaders) {
                    interestedHeaders[k] = headers[k];
                }
            }

            const siteName = target.siteName;

            let response = {
                batchInitiatedAt, batchInitiatedAtISO,
                batchId, requestId, requestIgnitedAt, requestArrivedAt,
                roundTrip, siteName, url, statusCode, statusMessage,
                'headers': interestedHeaders
            } as ISimplifiedResponse;

            console.log(response);

            return response;
        })
        .then(d => saveResponse(d));

        promises.push(promise);
    }

    await Promise.allSettled(promises)
    .then(d => res.status(200).json({
        ok: true,
        msg: 'No error(s).'
    }))
    .catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Internal Error'
        });
    })
    .finally(() => {
        res.end();
    });
}

export default requestHandler;