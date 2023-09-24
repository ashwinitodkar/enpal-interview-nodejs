import { UrlRepository } from "./url.repository";
import generate from "../helper/util";
import {
  isIllegalDomain,
  isRestrictedDomain,
  isContainsBannedWords
} from "../helper/validateUrl";
import { CacheService } from "../cache/cache.service";
import { SHORT_URL_HOST } from "./url.constant";
import logger from "../lib/logger";

const urlRepository = new UrlRepository();
const cacheService = new CacheService();

export class UrlController {
  async createShortUrl(req, res, next) {
    try {
      const url: string = req.body.originalUrl;

      if (isContainsBannedWords(url))
        return res.status(400).json({ message: "URL contains a banned word" });

      if (isIllegalDomain(url))
        return res.status(451).json({ message: "This content is illegal" });

      const result = await urlRepository.getOriginalUrlDetails(
        req.body.originalUrl
      );

      if (result) {
        return res.json({ shortUrl: `${SHORT_URL_HOST}/${result.shortId}` });
      }

      //generate short url and save
      const shortId = generate.generateShortId();

      await urlRepository.createShortUrl({
        originalUrl: req.body.originalUrl,
        shortId: shortId,
      });

      //save to cache
      cacheService.set(shortId, req.body.originalUrl);
      logger.info(`cache for future read, ${shortId}`);

      res.json({ shortUrl: `${SHORT_URL_HOST}/${shortId}` });
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async redirectToOriginalUrl(req, res) {
    try {
      logger.info(`${req.params.slug}`);

      //check cache hit
      const cachedUrl = cacheService.get(req.params.slug);
      let originalUrl;

      if (cachedUrl) {
        logger.info("cache hit", req.params.slug);
        originalUrl = cachedUrl;
      } else {
        logger.info("cache miss", req.params.slug);
        const result = await urlRepository.getShortId(req.params.slug);
        originalUrl = result?.originalUrl;

        const success = originalUrl
          ? cacheService.set(req.params.slug, originalUrl)
          : false;
        logger.info("cache for future read ", req.params.slug, " ", success);
      }

      if (originalUrl) {
        if (!req.query.isadult && isRestrictedDomain(originalUrl))
          return res.status(403).send("You're not allowed to access this page");

        urlRepository.updateLastAccessedOn(req.params.slug);

        return res.redirect(originalUrl);
      }

      return res.status(404).send();
    } catch (err) {
      logger.error(err);
      res.status(500).json("Server Error");
    }
  }
}
