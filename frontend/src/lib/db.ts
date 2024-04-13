
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/tempus';

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export default clientPromise;
