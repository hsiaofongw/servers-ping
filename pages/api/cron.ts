import { NextApiRequest, NextApiResponse } from 'next'

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const headers = req.headers;
    console.log(headers);

    res.status(200).json({ text: 'Hello' });
}

export default requestHandler;