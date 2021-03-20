import { NextApiRequest, NextApiResponse } from 'next';
import { getLastGeneralCheck } from '../../helpers/dto';

let cache = {
    updated: (new Date()).valueOf(),
    content: {
        lastCheck: undefined
    }
};

async function updateCache() {

    // 缓存有效期 1 分钟
    let maxAge = 1000 * 60 * 1;

    const now = (new Date()).valueOf();
    const age = now - cache.updated;
    let cacheStatus = "hit";

    if ((age > maxAge) || (cache.content.lastCheck === undefined)) {
        cacheStatus = "miss";
        cache.content.lastCheck = await getLastGeneralCheck();
        cache.updated = now;
    }

    return {
        date: cache.updated,
        age: cache.updated - now,
        cacheStatus,
        maxAge,
        lastCheck: cache.content.lastCheck
    };
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const result = await updateCache();
    res.setHeader('Date', result.date);
    res.setHeader('Age', result.age);
    res.setHeader('x-application-debug-cache-status', result.cacheStatus);

    // result.maxAge 单位是 毫秒， Cache-Control 的 max-age 单位是 秒．
    const maxAge = Math.ceil(result.maxAge / 1000);
    const cacheControl = `public, max-age=${maxAge}`;
    res.setHeader('Cache-Control', cacheControl);

    res.status(200).json(result.lastCheck);
}

export default requestHandler;
