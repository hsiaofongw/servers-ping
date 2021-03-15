import { MongoClient } from 'mongodb';

const username = process.env?.DB_USERNAME || "usernameNotFound";
const password = process.env?.DB_PASSWORD || "passwordNotFound";
const cluster = process.env?.CLUSTER_NAME || "noClusterFound";

let uri = "mongodb+srv://<username>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
uri = uri.replace("<username>", username);
uri = uri.replace("<password>", password);
uri = uri.replace("<cluster-url>", cluster);

console.log({
    username, password, cluster, uri
});

const client = new MongoClient(uri);
const dbName = "serversping";
const triggerLogsCollName = "triggerLogs";

export async function saveTriggerLog(triggerLog: ITriggerLog) {

    try {
        await client.connect();
        const database = client.db(dbName);
        const triggerLogsColl = database.collection(triggerLogsCollName);
        const result = await triggerLogsColl.insertOne(triggerLog);
        console.log({
            datetime: new Date().toISOString(),
            invoked: "saveTriggerLog",
            insertedId: result.insertedId,
            insertedCount: result.insertedCount
        });
    } finally {
        await client.close();
    }

}