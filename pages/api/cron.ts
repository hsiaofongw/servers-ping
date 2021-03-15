import { NextApiRequest, NextApiResponse } from 'next';
import targets from '../../data/watchList.json';
import got from 'got';
import { saveTriggerLog } from '../../helpers/triggerLogsDto';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const datetime = new Date();

    let triggerLog = { 
        datetime: datetime.toISOString(),
        since: datetime.valueOf(),
        responses: [] as ISimplifiedResponse[]
    };

    let resultsPromise = targets.map(async (target) => {
        const timeStart = new Date().valueOf();
        const { headers, statusCode } = await got(target.url);
        const timeReceive = new Date().valueOf();
        const roundtrip = timeReceive - timeStart;

        let response = {
            datetime: new Date().toISOString(),
            'siteName': target.siteName,
            'url': target.url,
            'statusCode': statusCode,
            'headers': {},
            timeStart,
            timeReceive,
            roundtrip
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