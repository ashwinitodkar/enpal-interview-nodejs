// db.ts
import mongoose, { Connection } from "mongoose";
import { Config } from "../config/envConfig";
import logger from "./logger";

// Create a connection function
export async function connectDB(): Promise<Connection> {
  try {
    await mongoose.connect(Config.mongo.uri, { socketTimeoutMS: 1000 });
    logger.info("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
}
