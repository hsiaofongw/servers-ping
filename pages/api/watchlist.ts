import { NextApiRequest, NextApiResponse } from 'next';
import { getTargets } from '../../helpers/dto';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IWatchTarget[]>) {

    const data = await getTargets();
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json(data);
    
}

export default requestHandler;