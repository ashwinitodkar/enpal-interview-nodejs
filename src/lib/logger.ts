1
import { createLogger, transports, format } from "winston";
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    format.splat(),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    format.printf(({ level, message, timestamp, metadata }) => {
      return (
        `${level}: ${[timestamp]}: ` +
        (undefined !== message ? message : '') +
        (metadata && Object.keys(metadata).length ? '\n\t' + JSON.stringify(metadata) : '')
      );
    })
  ),
  transports: [new transports.Console()],
});

export default logger;