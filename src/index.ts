import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import { UrlController } from "./url/url.controller";
import { connectDB } from "./lib/mongodb";
import logger from './lib/logger';


async function main() {
  const server = express();

  const urlController = new UrlController();

  /**
   * Initialize post data parsing.
   **/
  server.use(bodyParser.json());

  server.post("/link", urlController.createShortUrl);

  server.get("/:slug", urlController.redirectToOriginalUrl);

  
  // Default handler for invalid API endpoint.
  
  server.all("*", (req, res) => {
    logger.info(`${req.method} - ${req.url}`);
    res.status(404).json({message: "Invalid Request" });
  });

  // Default handler for uncaught exception error.
  server.use(async (err, req, res, _next: NextFunction) => {
    logger.error(
      `UncaughtException is encountered 
        In ${req.method}
        Error= ${err},
        Stacktrace= ${err.stack} `
    );
    
    res
      .status(500)
      .json({ message: "Opps something went wrong, please try again."});
  });

  await connectDB();

  await server.listen(process.env.APP_PORT, () => {
    logger.info(`Server listening on port ${process.env.APP_PORT}`);
  });
}

main();
