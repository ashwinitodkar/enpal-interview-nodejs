import * as httpMocks from "node-mocks-http";
import { UrlController } from "./url.controller";
import { UrlRepository } from "./url.repository";
import { BANNED_WORDS, ILLEGAL_DOMAINS, SHORT_URL_HOST } from "./url.constant";
import util from "../helper/util";
//import { CacheService } from '../cache/cache.service';

jest.mock("../cache/cache.service");
jest.mock("../helper/util");

describe("UrlController", () => {
  let controller: UrlController;

  beforeAll(() => {
    controller = new UrlController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it("Should create and return new short URL when does not exists in database", async () => {
    // Given
    const originalUrl = "https://a-long-url.com/tobeshorten";
    const shortId = "short-key";
    var request = httpMocks.createRequest({
      method: "POST",
      url: "/link",
      body: {
        originalUrl,
      },
    });

    UrlRepository.prototype.getOriginalUrlDetails = jest
      .fn()
      .mockResolvedValueOnce(null);

    UrlRepository.prototype.createShortUrl = jest
      .fn()
      .mockResolvedValueOnce({ originalUrl, shortId });

    util.generateShortId = jest.fn().mockReturnValueOnce(shortId);

    var response = httpMocks.createResponse();

    await controller.createShortUrl(request, response ,()=>{});

    var data = response._getJSONData();
    expect(data.shortUrl).toBe(`${SHORT_URL_HOST}/${shortId}`);
    expect(response.statusCode).toBe(200);
    expect(UrlRepository.prototype.createShortUrl).toHaveBeenCalledWith({ originalUrl, shortId });
  });

  it("Should retrun the existing short URL when exists in database", async () => {
    // Given
    const originalUrl = "https://a-long-url.com/tobeshorten";
    const shortId = "short-key";
    var request = httpMocks.createRequest({
      method: "POST",
      url: "/link",
      body: {
        originalUrl,
      },
    });

    UrlRepository.prototype.getOriginalUrlDetails = jest
      .fn()
      .mockResolvedValueOnce({ shortId });

    var response = httpMocks.createResponse();

    await controller.createShortUrl(request, response, ()=>{});

    var data = response._getJSONData();
    expect(data.shortUrl).toBe(`${SHORT_URL_HOST}/${shortId}`);
    expect(response.statusCode).toBe(200);
    expect(UrlRepository.prototype.createShortUrl).not.toHaveBeenCalled();
  });

  it("Should retrun bad request if banned words found", async () => {
    // Given
    const originalUrl = BANNED_WORDS[0];
    var request = httpMocks.createRequest({
      method: "POST",
      url: "/link",
      body: {
        originalUrl,
      },
    });

    var response = httpMocks.createResponse();

    await controller.createShortUrl(request, response, ()=>{});

    var data = response._getData();
    expect(data.shortUrl).toBe(undefined);
    expect(response.statusCode).toBe(400);
    expect(UrlRepository.prototype.createShortUrl).not.toHaveBeenCalled();
  });

  it("Should 451 if illegal domain found", async () => {
    // Given
    const originalUrl = `https://${ILLEGAL_DOMAINS[0]}`;
    var request = httpMocks.createRequest({
      method: "POST",
      url: "/link",
      body: {
        originalUrl,
      },
    });

    var response = httpMocks.createResponse();

    await controller.createShortUrl(request, response, ()=>{});

    var data = response._getData();
    expect(data.shortUrl).toBe(undefined);
    expect(response.statusCode).toBe(451);
    expect(UrlRepository.prototype.createShortUrl).not.toHaveBeenCalled();
  });

});
