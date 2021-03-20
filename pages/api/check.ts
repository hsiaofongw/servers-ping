import { NextApiRequest, NextApiResponse } from 'next';
import { getResponses, saveGeneralCheck } from '../../helpers/dto';
import { ResponseCheck } from '../../helpers/responseCheck';

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {

    const ip = (req.headers['x-real-ip'] as string) || '';
    if (ip !== process.env?.ALLOWED_IP) {
        res.status(403).json({
            ok: false,
            msg: 'Forbidden'
        });
        return;
    }

    const t1 = (new Date()).valueOf();
    const { rangeLengthInput } = req.query;
    if (typeof rangeLengthInput === 'string') {

        let rangeLength = parseInt(rangeLengthInput);
        const oneDayLength = 24 * 60 * 60 * 1000;
        if (rangeLength > oneDayLength) {
            rangeLength = oneDayLength;
        }

        const t0 = t1 - rangeLength;
        const responses = await getResponses(t0);

        const positive = responses.some(resp => ResponseCheck.anomalyDetech(resp));

        const logObject = {
            initiatedAt: t1,
            checkAllResponsesSince: t0,
            numberOfResponsesChecked: responses.length,
            rangeLength: rangeLength,
            result: {
                positive
            }
        };

        await saveGeneralCheck(logObject);
        res.status(200).json(logObject);
    }
    else {
        res.status(400).json({
            ok: false,
            msg: 'Provide rangeLength in miliseconds.'
        });
    }
}

export default requestHandler;

