import { BANNED_WORDS, ILLEGAL_DOMAINS, RESTRICTED_DOMAINS } from "../url/url.constant";
import logger from '../lib/logger';

export function isContainsBannedWords(url) {
  try {
    return BANNED_WORDS.some((word) => url.includes(word));
  } catch (error) {
    console.error("error in isContainsBannedWords:", error);
    throw error;
  }
}

export function validateDomains(url, domains) {
  try {
    const host = new URL(url);
    return domains.some((domain) => host.hostname.includes(domain));
  } catch (error) {
    logger.error("error in validateDomains:", error);
    throw error;
  }
}

export function isIllegalDomain(url) {
  return validateDomains(url, ILLEGAL_DOMAINS);
}

export function isRestrictedDomain(url) {

  return validateDomains(url, RESTRICTED_DOMAINS);
}

export function isValidUrl(url) {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + //domain
      "((\\d{1,3}\\.){3}\\d{1,3}))" + //ipv4
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port/path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // QS
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return !!urlPattern.test(url);
}
