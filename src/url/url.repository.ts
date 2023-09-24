// app.ts
import { UrlModel } from "./url.model";

export class UrlRepository {
  async createShortUrl(urlData) {
    const newUrl = new UrlModel(urlData);
    const document = await newUrl.save();
    return document;
  }

  async getOriginalUrlDetails(originalUrl) {
    const document = await UrlModel.findOne({
      originalUrl: originalUrl,
    }).exec();
    return document;
  }

  async getShortId(shortId) {
    const document = await UrlModel.findOne({ shortId: shortId }).exec();
    return document;
  }

  async updateLastAccessedOn(shortId) {
    const document = await UrlModel.findOneAndUpdate(
      { shortId: shortId },
      { lastAccessedOn: new Date() }
    ).exec();
    return document;
  }

  async deleteOldRecords(days) {
    // Calculate the duration in days ago from the current date
    const today = new Date();
    today.setDate(today.getDate() - days);

    // Delete records older than given days
    const result = await UrlModel.deleteMany({ timestamp: { $lt: today } });
    return result;
  }
}
