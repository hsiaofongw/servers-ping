import { MongoClient } from 'mongodb';
import targetsData from '../data/watchList.json';
import dailyLogs from '../data/handWrittenLogs.json';

const username = process.env?.DB_USERNAME || "usernameNotFound";
const password = process.env?.DB_PASSWORD || "passwordNotFound";
const cluster = process.env?.CLUSTER_NAME || "noClusterFound";

let uri = "mongodb+srv://<username>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
uri = uri.replace("<username>", username);
uri = uri.replace("<password>", password);
uri = uri.replace("<cluster-url>", cluster);

const dbName = "serversping";
const responsesCollName = "simplifiedResponses";
const generalChecksCollName = "generalChecks";

export async function saveManyResponses(resps: ISimplifiedResponse[]) {

    const client = new MongoClient(uri);

    try {
        let batchId = "";
        if (resps.length) {
            batchId = resps[0].batchId;
        }
        
        await client.connect();
        const database = client.db(dbName);
        const responsesColl = database.collection(responsesCollName);
        const result = await responsesColl.insertMany(resps);
        console.log({
            datetime: new Date().toISOString(),
            batchId,
            invoked: "saveManyResponses",
            insertedCount: result.insertedCount
        });
    } finally {
        await client.close();
    }

}


export async function saveGeneralCheck(check: IGeneralCheck) {

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const generalChecksColl = database.collection(generalChecksCollName);
        const result = await generalChecksColl.insertOne(check)
        console.log({
            datetime: new Date().toISOString(),
            invoked: "saveGeneralCheck",
            insertedCount: result.insertedCount
        });
    } finally {
        await client.close();
    }

}

export async function getTargets() {
    const targets = targetsData as IWatchTarget[];
    return targets;
}

export async function getResponses(since: number): Promise<ISimplifiedResponse[]> {
    const client = new MongoClient(uri);

    const query = {
        batchInitiatedAt: {
            "$gte": since
        }
    };

    const options = {
        projection: { _id: 0 },
    };

    try {
        await client.connect();
        const database = client.db(dbName);
        const responsesColl = database.collection(responsesCollName);
        const cursor = responsesColl.find(query, options);

        let results = [] as ISimplifiedResponse[];
        await cursor.forEach(d => {
            results.push(d as ISimplifiedResponse);
        });

        return results;
    } finally {
        await client.close();
    }

}

export async function getDailyLogs(): Promise<IDailyLog[]> {
    return dailyLogs;
}

export async function getLastGeneralCheck(): Promise<IGeneralCheck> {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const generalChecksColl = database.collection(generalChecksCollName);
        const options = {
            projection: { _id: 0 },
            sort: { initiatedAt: -1 }
        };
        const result = await generalChecksColl.findOne({}, options) as IGeneralCheck;
        return result;
    } finally {
        await client.close();
    }

}