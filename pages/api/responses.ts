import { NextApiRequest, NextApiResponse } from 'next';
import { getResponses } from '../../helpers/dto';

let cache = {
    updated: (new Date()).valueOf(),
    content: {
        simplifiedResponses: undefined
    }
};

async function updateCache() {

    // 缓存有效期 5 分钟
    let maxAge = 1000 * 60 * 5;

    const now = (new Date()).valueOf();
    const oneDay = 24 * 60 * 60 * 1000;
    const dayBefore = now - oneDay;
    const age = now - cache.updated;
    let cacheStatus = "hit";

    if ((age > maxAge) || (cache.content.simplifiedResponses === undefined)) {
        cacheStatus = "miss";
        cache.content.simplifiedResponses = await getResponses(dayBefore);
        cache.updated = now;
    }

    return {
        date: cache.updated,
        age: cache.updated - now,
        cacheStatus,
        maxAge,
        simplifiedResponses: cache.content.simplifiedResponses
    };
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const result = await updateCache();
    res.setHeader('Date', result.date);
    res.setHeader('Age', result.age);
    res.setHeader('x-application-debug-cache-status', result.cacheStatus);

    const maxAge = Math.ceil(result.maxAge / 1000);
    const cacheControl = `public, max-age=${maxAge}`;
    res.setHeader('Cache-Control', cacheControl);

    res.status(200).json(result.simplifiedResponses);
}

export default requestHandler;