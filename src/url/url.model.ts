import mongoose, { Schema } from "mongoose";
export const collectionName = "urls";

const urlSchema: Schema = new Schema(
  {
    shortId: {
      index: true,
      required: true,
      type: String,
      unique: true,
    },
    originalUrl: {
      index: true,
      required: true,
      type: String,
    },
    lastAccessedOn: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UrlModel = mongoose.model(collectionName, urlSchema);
