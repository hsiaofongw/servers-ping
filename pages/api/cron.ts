import { NextApiRequest, NextApiResponse } from 'next';
import targets from '../../data/watchList.json';
import got from 'got';
import { saveTriggerLog } from '../../helpers/triggerLogsDto';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    let triggerLog = { 
        datetime: new Date().toISOString(),
        invokedAPI: '/api/cron',
        headers: {},
        responses: [] as ISimplifiedResponse[]
    };

    for (const k in req.headers) {
        triggerLog.headers[k] = req.headers[k];
    }

    let resultsPromise = targets.map(async (target) => {
        const { headers, statusCode } = await got(target.url);

        let response = {
            datetime: new Date().toISOString(),
            'siteName': target.siteName,
            'url': target.url,
            'statusCode': statusCode,
            'headers': {}
        };

        console.log(response);
        
        response['headers'] = headers;

        triggerLog.responses.push(response);
    });

    Promise.allSettled(resultsPromise)
    .then(async (values) => {
        return await saveTriggerLog(triggerLog);
    })
    .then(values => {
        res.status(200).json(triggerLog);
    }).finally(() => {
        res.end();
    });
}

export default requestHandler;