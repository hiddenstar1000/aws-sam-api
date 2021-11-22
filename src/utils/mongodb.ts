import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const mongoUri = process.env.MONGODB_URI;

const client = new MongoClient(mongoUri ? mongoUri : "", {
  retryWrites: true,
  w: "majority",
});

const clientPromise = client.connect();

export default class CustomMongoClient {
  constructor() {}

  async create(collectionName: string, item: any) {
    const id = uuidv4();
    item._id = id;

    const connection = await clientPromise;
    return await connection.db().collection(collectionName).insertOne(item);
  }

  async read(collectionName: string, id: any) {
    const connection = await clientPromise;
    return await connection
      .db()
      .collection(collectionName)
      .findOne({ _id: id });
  }

  async readAll(collectionName: string) {
    const connection = await clientPromise;
    return await connection.db().collection(collectionName).find({}).toArray();
  }

  async update(collectionName: string, item: any, id: any) {
    const connection = await clientPromise;
    return await connection
      .db()
      .collection(collectionName)
      .updateOne({ _id: id }, { $set: item });
  }

  async delete(collectionName: string, id: any) {
    const connection = await clientPromise;
    return await connection
      .db()
      .collection(collectionName)
      .deleteOne({ _id: id });
  }
}
