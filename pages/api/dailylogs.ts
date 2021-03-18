import { NextApiRequest, NextApiResponse } from 'next';
import { getDailyLogs } from '../../helpers/dto';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IDailyLog[]>) {

    const data = await getDailyLogs();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(data);
    
}

export default requestHandler;