import { NextApiRequest, NextApiResponse } from 'next';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    let logObject = { 
        headers: {
            host: '',
            authorization: '',
            'x-matched-path': '',
            'x-forwarded-host': '',
            accept: '',
            'x-vercel-deployment-url': '',
            'x-forwarded-proto': '',
            'x-forwarded-for': '',
            'user-agent': '',
            'x-vercel-forwarded-for': '',
            'x-real-ip': '',
            'x-vercel-id': '',
            connection: '',
            'transfer-encoding': ''
        }
    };

    for (const k in req.headers) {
        logObject.headers[k] = req.headers[k];
    }

    console.log(logObject);
    res.status(200).json(logObject);
}


export default requestHandler;