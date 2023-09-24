import { Config } from "../config/envConfig";

export const SHORT_URL_HOST = `${Config.protocol}${Config.domain}:${Config.appPort}`;
export const BANNED_WORDS = [
  "bannedi",
  "bannedii",
  "bannediii",
  "bannediv",
  "bannedv",
];
export const ILLEGAL_DOMAINS = [
  "illegali.com",
  "illegalii.com",
  "illegaliii.com",
  "illegaliv.com",
  "illegalv.com",
];
export const RESTRICTED_DOMAINS = [
  "restrictedi.com",
  "restrictedii.net",
  "restrictediii.io",
  "restrictediv.com",
  "restrictedv.io",
];
