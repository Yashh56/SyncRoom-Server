import { PrismaClient as SQLClient } from "../prisma/generated/client/client.js";
import { PrismaClient as MongoClient } from "../prisma/generated/mongo/client.js";

export const sql = new SQLClient();
export const mongo = new MongoClient();
