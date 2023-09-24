import { v4 as uuidv4 } from "uuid";
import logger from '../lib/logger';

const generateShortId = () => {
  try {
    const uuid: string = uuidv4();
    logger.info(`new generated uuid- ${uuid}`);
    const encodedString = Buffer.from(uuid).toString("base64");
    return encodedString.substring(0, 8);
  } catch (error) {
    logger.error("error at generate short id:", error);
    throw error;
  }
};

export default { generateShortId };
