import { NextApiRequest, NextApiResponse } from 'next';
import data from '../../data/watchList.json';

async function requestHandler(req: NextApiRequest, res: NextApiResponse<IWatchTarget[]>) {

    res.status(200).json(data);
    
}

export default requestHandler;